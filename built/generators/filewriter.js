"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
//take in HTML and CSS and generate a nice bundle!
exports.default = WriteOutputFile;
function WriteOutputFile(filename, value) {
    fs.writeFile("../output/" + filename, value, function (err) {
        if (err) {
            console.log(filename + " File Writing Error");
            return console.log(err);
        }
        console.log("The " + filename + " file was saved!");
    });
}
