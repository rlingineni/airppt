require("module-alias/register");
import * as JSZip from "jszip";
import fs = require("fs");
import * as xml2js from "xml2js-es6-promise";
import GridScaler from "./gridscalerts";
import CSSGenerator from "@generators/cssgenerator";
import HTMLGenerator from "@generators/htmlgenerator";
import PowerpointElementParser from "./elementparser";
import WriteOutputFile from "@generators/filewriter";
import * as ShapeRenderers from "@renderers/shapes";
import { ElementType, SpecialityType } from "@models/pptelement";
import { PositionType } from "@models/css";

loadZip();
async function loadZip() {
	var zip = new JSZip();
	let data = await getData("../TeluguApp.pptx");
	let zipResult = await zip.loadAsync(data);

	let slideShowGlobals = await parseSlideAttributes(zipResult, "ppt/presentation.xml");
	let slideShowTheme = await parseSlideAttributes(zipResult, "ppt/theme/theme1.xml");

	let slideSizeX = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cx"];
	let slideSizeY = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cy"];
	let pptElementParser = new PowerpointElementParser(slideShowGlobals, slideShowTheme);

	//Parse ppt/presentation.xml and get size
	let scaler = new GridScaler(slideSizeX, slideSizeY, 12);
	let htmlGen = new HTMLGenerator();
	//Place elements in right position for HTML
	let slideAttributes = await parseSlideAttributes(zipResult, "ppt/slides/slide2.xml");
	console.log(JSON.stringify(slideAttributes));
	let slideElements = slideAttributes["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:sp"];

	let elementsCSS = [];

	for (let element of slideElements) {
		//parse element body
		let pptElement = pptElementParser.getProcessedElement(element);
		if (pptElement) {
			console.log(pptElement);
			let rendererType = pptElement.speciality == SpecialityType.None ? pptElement.shapeType : pptElement.speciality;
			console.log(rendererType);
			//Convert PPT shapes
			let renderedElement = new ShapeRenderers[rendererType](scaler, pptElement, slideShowGlobals, slideShowTheme, PositionType.Absolute);
			let elementCSS = renderedElement.getCSS();
			let html = renderedElement.render();

			//add HTML and CSS to files
			elementsCSS.push(elementCSS);
			htmlGen.addElementToDOM(html);
		}
	}

	//Create Output HTML file
	WriteOutputFile("abs.css", CSSGenerator.generateCSS(PositionType.Absolute, elementsCSS));
	WriteOutputFile("grid.css", CSSGenerator.generateCSS(PositionType.Grid, elementsCSS));
	WriteOutputFile("index.html", htmlGen.getGeneratedHTML());
}

async function parseSlideAttributes(zipResult, fileName) {
	let presentationSlide = await zipResult.file(fileName).async("string");
	let parsedPresentationSlide = await xml2js(presentationSlide, { trim: true });
	return parsedPresentationSlide;
}

function getData(fileName): Promise<Buffer> {
	return new Promise(function(resolve, reject) {
		fs.readFile(fileName, (err, data) => {
			err ? reject(err) : resolve(data);
		});
	});
}
