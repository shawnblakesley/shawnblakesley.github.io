const fs = require('fs');
const path = require('path');
const pug = require('pug');
const sass = require('sass');
const watch = require('node-watch');
const yaml = require('yamljs');
const yargs = require('yargs');
const minify = require('@node-minify/core');
const cssnano = require('@node-minify/cssnano');
const uglifyES = require('@node-minify/uglify-es');

const watch_delay_ms = 500;

const argv = yargs
    .option('watch', {
        alias: 'w',
        description: 'Watch for file changes in the src directory',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;

function isSpecial(source, target, special_handling) {
    var temp = special_handling.slice();
    if (temp.map(function (special) {
            match = source.match(special.regex);
            if (match != null) {
                special.apply(source, target);
            }
            return match;
        }).filter(function (val) {
            return val !== null;
        }).length > 0) {
        return true;
    }

    return false;
}

function copyTree(source, target, special_handling = []) {
    copyTreeBase(source, "", target, special_handling);
}

function copyTreeBase(base, source, target, special_handling = new Map()) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, {
            recursive: true,
        });
    }

    //copy
    var fullSource = path.join(base, source)
    if (fs.lstatSync(fullSource).isDirectory()) {
        files = fs.readdirSync(fullSource);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            fullSource = path.join(base, curSource);
            var outFile = path.join(targetFolder, file)
            if (!isSpecial(fullSource, outFile, special_handling)) {
                if (fs.lstatSync(fullSource).isDirectory()) {
                    copyTreeBase(base, curSource, targetFolder, special_handling);
                } else {
                    console.log("\x1b[35m>\x1b[0m %s \x1b[32m=>\x1b[0m %s", fullSource, outFile);
                    fs.copyFileSync(fullSource, outFile);
                }
            }
        });
    }
}

function configure(root, out) {
    console.log("🤞 ~ running configure ~ 🤞");
    fs.rmdirSync(out, {
        recursive: true
    });
    fs.mkdirSync(out, {
        recursive: true
    });
    // fs.readdirSync(root).forEach(file => {
    //     console.log(file);
    // });
    let pug_data_file = path.join(root, "data", 'data.yml');
    let locals = yaml.load(pug_data_file);
    copyTree(root, out, [{
        regex: /.*\.pug/g,
        apply: function (source, target) {
            let out_file = pug.renderFile(source, locals);
            let out_file_name = path.join(path.dirname(target), path.basename(target, ".pug") + ".html")
            fs.writeFileSync(out_file_name, out_file);
            console.log("\x1b[35m>\x1b[0m %s \x1b[32m=>\x1b[0m %s", source, out_file_name);
        }
    }, {
        regex: /.*\.scss/g,
        apply: function (source, target) {
            let out_file = sass.renderSync({
                file: source,
                outputStyle: "compressed",
            });
            let out_file_name = path.join(path.dirname(target), path.basename(target, ".scss") + ".css")
            fs.writeFileSync(out_file_name, out_file.css);
            console.log("\x1b[35m>\x1b[0m %s \x1b[32m=>\x1b[0m %s", source, out_file_name);
        }
    }, {
        regex: /.*\.css/g,
        apply: function (source, target) {
            minify({
                compressor: cssnano,
                input: source,
                output: target
            });
            console.log("\x1b[35m>\x1b[0m %s \x1b[32m=>\x1b[0m %s", source, target);
        }
    }, {
        regex: /^((?!min).)+\.js$/g,
        apply: function (source, target) {
            minify({
                compressor: uglifyES,
                input: source,
                output: target
            });
            console.log("\x1b[35m>\x1b[0m %s \x1b[32m=>\x1b[0m %s", source, target);
        }
    }]);
    fs.rmdirSync(path.join(out, "includes"), {
        recursive: true
    });
    console.log("\x1b[31mX\x1b[0m Removed %s", path.join(out, "includes"));
    let pug_out_file = pug_data_file.replace(root, out);
    fs.unlinkSync(pug_out_file);
    console.log("\x1b[31mX\x1b[0m Removed %s", pug_out_file);
    console.log("🎉 ~ finished configure ~ 🎉");
}

function watching() {
    try {
        configure("src", "dist");
    } catch (err) {
        console.error(err, "\n\nStill watching...");
    }
}

if (argv.watch) {
    var timeoutVariable = setTimeout(watching, watch_delay_ms);

    watch('src', {
        recursive: true
    }, function () {
        clearTimeout(timeoutVariable);
        timeoutVariable = setTimeout(watching, watch_delay_ms);
    });
} else {
    configure("src", "dist");
}