import ZipHandler from "@helpers/ziphandler";
import fs = require("fs");
import convertToPNG from "../helpers/tiffConverter";
import { WriteOutputFile } from "@generators/index";
export default copyAssetToOutputDirectory;

//helper that moves image based asset from ppt to output directory

async function copyAssetToOutputDirectory(assetPath, convertTifftoPNG: boolean) {
	//get the file from the zipfile
	let assetData = await ZipHandler.getFileInZip(assetPath);
	let fileName = assetPath.split("/").pop();

	//copy the file to the output
	await WriteOutputFile("assets/media/" + fileName, assetData, { encoding: "base64" });

	//if it is an ppt image (ppt converts native images to tiffs), then do this step
	if (convertTifftoPNG) {
		let fileExtension = fileName.split(".").pop();
		if (fileExtension === "tiff") {
			let newFileName = fileName.split(".")[0] + ".png"; //convert to png
			convertToPNG("../output/assets/media/" + fileName, "assets/media/" + newFileName);
		}
	}
}
