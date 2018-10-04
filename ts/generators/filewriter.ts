import fs = require("fs");
import { AnySrvRecord } from "dns";
//take in HTML and CSS and generate a nice bundle!

export default WriteOutputFile;

//TO-DO: Allow this to be configurable
//must also udpdate assetmover.ts
function WriteOutputFile(filename: string, value: string, options: any = {}): Promise<boolean> {
	return new Promise(function(resolve, reject) {
		//make an output folder
		if (!fs.existsSync("../output")) {
			fs.mkdirSync("../output");
			fs.mkdirSync("../output/assets");
			fs.mkdirSync("../output/assets/media");
		}

		fs.writeFile("../output/" + filename, value, options, function(err) {
			if (err) {
				console.log(filename + " File Writing Error");
				reject(err);
			} else {
				console.log("The " + filename + " file was written!");
				resolve(true);
			}
		});
	});
}
