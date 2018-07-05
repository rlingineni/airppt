"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
//take in HTML and CSS and generate a nice bundle!
exports.default = WriteOutputFile;
function WriteOutputFile(filename, value, options = {}) {
    return new Promise(function (resolve, reject) {
        fs.writeFile("../output/" + filename, value, options, function (err) {
            if (err) {
                console.log(filename + " File Writing Error");
                reject(err);
            }
            console.log("The " + filename + " file was written!");
            resolve(true);
        });
    });
}
