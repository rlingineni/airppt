import fs = require("fs");
import { AnySrvRecord } from "dns";
//take in HTML and CSS and generate a nice bundle!

export default WriteOutputFile;

//TO-DO: Allow this to be configurable
function WriteOutputFile(filename: string, value: string, options: any = {}): Promise<boolean> {
	return new Promise(function(resolve, reject) {
		//make an output folder
		if (!fs.existsSync("../output")) {
			fs.mkdirSync("../output");
		}

		fs.writeFile("../output/" + filename, value, options, function(err) {
			if (err) {
				console.log(filename + " File Writing Error");
				reject(err);
			}

			console.log("The " + filename + " file was written!");
			resolve(true);
		});
	});
}
