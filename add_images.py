#!/usr/bin/env python3

import json
from pathlib import Path
import shutil
from termcolor import colored

import requests

IMAGES_PATH = Path("images", "alphabet_game")
JSON_FILE = Path("data", "alphabet_game.json")


def help_msg(*args, **kwargs):
    """List commands available to you."""
    print()
    for command in COMMANDS:
        print(f"{colored(command, 'green')} : {COMMANDS[command].__doc__}")
    print()


def list_images(data, *args, **kwargs):
    """Print all of the images already added to the list."""
    nl = colored("\n> ", "green")
    print(nl, end=' ')
    count = 0
    for key, value in data.data.items():
        for item in value:
            print(item["name"].rjust(20, ' '), end=' ')
            if count % 3 == 2:
                print(nl, end=' ')
            count += 1
    print()


def add_image(data, *args, **kwargs):
    """Add an image to the 
      Can be entered in one line with: add <url> <text>"""
    print()
    url, name = "", ""
    if args:
        url = args[0]
        print(f"{colored('Using url', 'cyan')}: {url}")
    if not url:
        url = input(f"{colored('Enter a image url', 'cyan')}: ")

    if len(args) > 1:
        name = args[1:]
        print(f"{colored('Using name', 'cyan')}: {'_'.join(name)}")
    if not name:
        name = input(f"{colored('Enter the name', 'cyan')}: ").split(' ')
    name = '_'.join(name)
    print(f"> Pretending to add url: {url}, name: {name}")
    data.add(url, name)
    print()


COMMANDS = {
    "help": help_msg,
    "list": list_images,
    "add": add_image,
}


class ImagesJson:
    def __init__(self, path: Path):
        if path is None:
            raise Exception("json path must be set.")
        if not path.exists():
            raise Exception("json path must exist.")
        self.path = path.absolute()
        with open(self.path) as file_pointer:
            self.data = json.load(file_pointer)

    def add(self, url, name):
        path, content_type = self.download_file(url, name)
        name = name.lower().split('_')
        for i, _ in enumerate(name):
            cap = name[i][0].upper()
            name[i] = cap + name[i][1:]
        name = "_".join(name)
        image_data = {
            "name": name,
            "phonetic": "",
        }
        if content_type != "jpg":
            image_data["type"] = content_type
        self.data[name[0].upper()].append(image_data)
        with open(self.path, 'w') as outfile:
            json.dump(self.data, outfile, indent=2)

    def download_file(self, url, name):
        local_filename = IMAGES_PATH / name.lower()
        r = requests.get(url, stream=True)
        content_type = r.headers.get('content-type')
        if 'png' in content_type:
            image_type = ".png"
        elif 'jpeg' in content_type or 'jpg' in content_type:
            image_type = ".jpg"
        else:
            print(f"ERROR: bad content type: {content_type}")
            return
        output_file = local_filename.absolute().with_suffix(image_type)
        print(f"FAKE Writing file: {colored(output_file, 'green')}")
        with open(output_file, 'wb') as f:
            shutil.copyfileobj(r.raw, f)
        return output_file, image_type[1:]


def main():
    data = ImagesJson(path=JSON_FILE)
    while True:
        command_line = input(f"{colored('Enter a command', 'cyan')} ('help' for options): ")
        command = command_line.split(' ')[0]
        args = command_line.split(' ')[1:]
        if command in COMMANDS:
            COMMANDS[command](data, *args)
        if command == "quit":
            return


if __name__ == "__main__":
    main()
