import ZipHandler from "@helpers/ziphandler";
import fs = require("fs");
import convertToPNG from "../helpers/tiffConverter";
import { WriteOutputFile } from "@generators/filewriter";
export default copyAssetToOutputDirectory;

async function copyAssetToOutputDirectory(assetPath, convertTifftoPNG: boolean) {
	//get the file from the zipfile
	let assetData = await ZipHandler.getFileInZip(assetPath);
	let fileName = assetPath.split("/").pop();

	await WriteOutputFile("../output/assets/media/" + fileName, assetData, { encoding: "base64" });
	//copy the file to the output

	if (convertTifftoPNG) {
		let fileExtension = fileName.split(".").pop();
		if (fileExtension === "tiff") {
			let newFileName = fileName.split(".")[0] + ".png"; //convert to png
			convertToPNG("../output/assets/media/" + fileName, "../output/assets/media/" + newFileName);
		}
	}
}
