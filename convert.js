const fs = require('fs');
const fse = require('fs-extra');
const json2scss = require('json2scss');
const path = require('path');
const Promise = require('promise');

const functionalColorMap = {
    "ansi-0-color": "black-normal",
    "ansi-1-color": "red-normal",
    "ansi-2-color": "green-normal",
    "ansi-3-color": "yellow-normal",
    "ansi-4-color": "blue-normal",
    "ansi-5-color": "magenta-normal",
    "ansi-6-color": "cyan-normal",
    "ansi-7-color": "white-normal",
    "ansi-8-color": "black-bright",
    "ansi-9-color": "red-bright",
    "ansi-10-color": "green-bright",
    "ansi-11-color": "yellow-bright",
    "ansi-12-color": "blue-bright",
    "ansi-13-color": "magenta-bright",
    "ansi-14-color": "cyan-bright",
    "ansi-15-color": "white-bright"
};

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
                //colors[colorId] = "rgb(" + colorRed + "," + colorGreen + "," + colorBlue + ")";
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
            fse.ensureDirSync("./dist/json");
            fse.ensureDirSync("./dist/sass");

            fs.writeFileSync('./dist/json/' + file + '.json', JSON.stringify(colors));

            var scss = json2scss(require('./dist/json/' + file + '.json'));

            fs.writeFileSync('./dist/sass/' + file + '.scss', scss);

            resolve();
        });

        fs.createReadStream('download/schemes/' + file + '.itermcolors')
            .pipe(saxStream);
    });
};

fs.readdir('./download/schemes', function(err, files) {
    if (err) return;
    files.forEach(function(f) {
        var fileBaseName = path.basename(f, '.itermcolors');

        if (fileBaseName == "Parasio Dark") return; // ToDo parsing fails on Parasio Dark -> https://github.com/mbadolato/iTerm2-Color-Schemes/pull/54

        console.log('Parsing ' + fileBaseName);
        parse(fileBaseName);
    });
});

