const useFunctionalVarNames = require('yargs').argv.functional;
const fs = require('fs');
const fse = require('fs-extra');
const json2scss = require('json2scss');
const path = require('path');
const Promise = require('promise');

const functionalColorMap = [
    {asIs: "ansi-0-color", functional: "black-normal"},
    {asIs: "ansi-1-color", functional: "red-normal"},
    {asIs: "ansi-2-color", functional: "green-normal"},
    {asIs: "ansi-3-color", functional: "yellow-normal"},
    {asIs: "ansi-4-color", functional: "blue-normal"},
    {asIs: "ansi-5-color", functional: "magenta-normal"},
    {asIs: "ansi-6-color", functional: "cyan-normal"},
    {asIs: "ansi-7-color", functional: "white-normal"},
    {asIs: "ansi-8-color", functional: "black-bright"},
    {asIs: "ansi-9-color", functional: "red-bright"},
    {asIs: "ansi-10-color", functional: "green-bright"},
    {asIs: "ansi-11-color", functional: "yellow-bright"},
    {asIs: "ansi-12-color", functional: "blue-bright"},
    {asIs: "ansi-13-color", functional: "magenta-bright"},
    {asIs: "ansi-14-color", functional: "cyan-bright"},
    {asIs: "ansi-15-color", functional: "white-bright"}
];

var parse = function (file) {
    const saxStream = require("sax").createStream(true, {}); // strict = true
    const rgbToHex = require('rgb-to-hex');

    var colors = {};

    var colorStarted;
    var colorId;
    var colorBlue;
    var colorGreen;
    var colorRed;
    var blue;
    var green;
    var red;
    var blueDone;
    var greenDone;
    var redDone;

    return new Promise(function (resolve, reject) {
        saxStream.on("opentag", function (node) {
            if (node.name == "key" && !colorStarted) {
                colorStarted = true;
            }

            if (node.name == "dict" && colorStarted) {
                blue = false;
                green = false;
                red = false;
                blueDone = false;
                greenDone = false;
                redDone = false;
            }
        });

        saxStream.on("closetag", function (node) {
            if (node == "dict" && colorStarted) {
                colorStarted = false;
            }
        });

        saxStream.on("text", function (text) {
            if (blueDone && greenDone && redDone) {
                colors[colorId] = "#" + rgbToHex("rgb(" + colorRed + "," + colorGreen + "," + colorBlue + ")");
            }

            if (text.match(/^[0-9]/)) {
                if (blue && !blueDone) {
                    colorBlue = Math.round(text * 255);
                    blueDone = true;
                }

                if (green && !greenDone) {
                    colorGreen = Math.round(text * 255);
                    greenDone = true;
                }

                if (red && !redDone) {
                    colorRed = Math.round(text * 255);
                    redDone = true;
                }
                return;
            }

            if (text.match(/^[BGR]/)) {
                switch (text) {
                    case "Blue Component":
                        blue = true;
                        break;
                    case "Green Component":
                        green = true;
                        break;
                    case "Red Component":
                        red = true;
                        break;
                }
            }

            if (text.indexOf("Color") > -1) {
                colorId = text.replace(/ /g, "-");
                colorId = colorId.toLowerCase();
                colors[colorId] = {};
            }
        });

        saxStream.on("end", function () {
            var distFolder = path.join(__dirname, "dist/abstract");

            var jsonString = JSON.stringify(colors, null, 2); // Pretty print Json

            if (useFunctionalVarNames) {
                functionalColorMap.forEach(function(map){
                    jsonString = jsonString.replace(map.asIs, map.functional);
                });
                distFolder = path.join(__dirname, "dist/functional");
            }

            fse.ensureDirSync(path.join(distFolder, "json"));
            fse.ensureDirSync(path.join(distFolder, "scss"));
            fse.ensureDirSync(path.join(distFolder, "less"));
            fse.ensureDirSync(path.join(distFolder, "sass"));
            fse.ensureDirSync(path.join(distFolder, "stylus"));

            // Generate JSON
            fs.writeFileSync(path.join(distFolder, "json") + '/' + file + '.json', jsonString);

            var scss = json2scss(require(path.join(distFolder, "json") + '/' + file + '.json'));
            var sass = scss.replace(/;/g,"");
            var stylus = sass.replace(/:/g,"");
            var less = scss.replace(/\$/g,"@");

            // Generate Scss
            fs.writeFileSync(path.join(distFolder, "scss") + '/' + file + '.scss', scss);

            // Generate Sass
            fs.writeFileSync(path.join(distFolder, "sass") + '/' + file + '.sass', sass);

            // Generate Stylus
            fs.writeFileSync(path.join(distFolder, "stylus") + '/' + file + '.styl', stylus);

            // Generate Less
            fs.writeFileSync(path.join(distFolder, "less") + '/' + file + '.less', less);

            resolve();
        });

        fs.createReadStream('download/schemes/' + file + '.itermcolors')
            .pipe(saxStream);
    });
};

fs.readdir('./download/schemes', function (err, files) {
    if (err) return;
    files.forEach(function (f) {
        var fileBaseName = path.basename(f, '.itermcolors');

        console.log('Parsing ' + fileBaseName);
        parse(fileBaseName);
    });
});

