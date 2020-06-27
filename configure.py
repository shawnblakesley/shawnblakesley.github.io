#!/usr/bin/env python3

import argparse
import asyncio
import os
from pathlib import Path
from shutil import copytree, ignore_patterns, rmtree

from rich import print
from watchgod import awatch


async def run(command):
    print(f"Running [purple4]{command}[/purple4]")
    proc = await asyncio.create_subprocess_shell(command)
    await proc.communicate()


def clean(*paths):
    for path in paths:
        print(f"Cleaning [green]{path}[/green]")
        rmtree(path, ignore_errors=True)
        os.makedirs(path)


def copy_from(path, subpath):
    print(
        f"Copying {subpath} from [green]{path}/{subpath}/[/green] to [green]./dist/{subpath}/[/green]"
    )
    copytree(
        f"{path}/{subpath}/",
        f"./dist/{subpath}/",
        ignore=ignore_patterns("*.pug", "*.scss"),
    )


async def build(path):
    clean("./dist", "./build")
    # cp -R src/images/* dist/images/
    for subpath in ["images", "css", "js", "data", "samples"]:
        copy_from(path, subpath)
    await run(f"npx postcss {path}/css/ --dir dist/css/")
    # npx sass src/styles.scss dist/styles.css
    await run(f"npx sass --style compressed {path}/styles.scss dist/css/styles.css")
    # npx yaml2json src/data.yml > build/data.json
    await run(f"npx yaml2json {path}/data.yml > build/data.json")
    # npx pug -P -O build/data.json src/index.pug --out dist

    # find {path} -name '*.pug' | xargs npx pug -s -O build/data.json {path}/{subpath} --out dist/{subpath}
    pug_files = []
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(".pug"):
                if "includes" not in root:
                    subpath = root.replace(path, "")
                    if subpath.startswith("/"):
                        subpath = subpath[1:]
                    pug_files.append(Path(subpath, file))
    for subpath in pug_files:
        await run(
            f"npx pug -s -O build/data.json {path}/{subpath} --out dist/{subpath.parent}"
        )


async def main(path):
    print(f"Building [bold deep_pink3]{path}[/bold deep_pink3]...")
    await build(path)
    print(f"\nWatching [bold blue]{path}[/bold blue]...")
    async for changes in awatch(path):
        print("[deep_pink3]Changes detected[/deep_pink3] for: ", end="")
        for change in changes:
            print(f"[bold blue_violet]{change[1]}[/bold blue_violet] ", end="")
        print()
        await build(path)
        print(f"\nWatching [bold blue]{path}[/bold blue]...")


if __name__ == "__main__":
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)

    parser = argparse.ArgumentParser(description="Process some integers.")
    parser.add_argument(
        "-w",
        "--watch",
        action="store_true",
        help="watch the files for local development",
    )

    args = parser.parse_args()
    loop = asyncio.get_event_loop()
    if args.watch:
        try:
            loop.run_until_complete(main("./src"))
        except KeyboardInterrupt:
            pass
    else:
        loop.run_until_complete(build("./src"))
