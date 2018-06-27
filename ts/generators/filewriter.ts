import fs = require('fs')
//take in HTML and CSS and generate a nice bundle!


export default WriteOutputFile


function WriteOutputFile(filename: string, value: string) {

    fs.writeFile("../output/" + filename, value, function (err) {
        if (err) {
            console.log(filename + " File Writing Error")
            return console.log(err);
        }

        console.log("The " + filename + " file was saved!");
    });
}

