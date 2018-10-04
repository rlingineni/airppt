require("module-alias/register");
const argv = require("optimist").default({ pos: "abs", slide: 1 }).argv;
import GridScaler from "./gridscalerts";
import { WriteOutputFile, CSSGenerator, HTMLGenerator } from "@generators/index";
import ZipHandler from "@helpers/ziphandler";
import PowerpointElementParser from "./parsers/elementparser";
import * as ShapeRenderers from "@renderers/index";
import { SpecialityType } from "@models/pptelement";
import { PositionType } from "@models/css";
import { BuildOptions } from "@models/options";

import * as format from "string-template";

GenerateUI();

export default function GenerateUI() {
	let config: BuildOptions = {
		PositionType: PositionType.Absolute,
		powerpointFilePath: "../sample.pptx",
		slideNum: argv.slide
	};

	if (argv.pos === "abs") {
	} else if (argv.pos === "grid") {
		config.PositionType = PositionType.Grid;
	} else {
		throw Error("Invalid element positioning type in arguements");
	}

	if (argv.input || argv.i) {
		config.powerpointFilePath = "../" + (argv.input || argv.i);
	} else {
		throw Error("No input argument with name of powerpoint file was given");
	}

	if (argv.position || argv.p) {
		config.PositionType = argv.position || argv.p;
	}

	if (argv.slide || argv.s) {
		config.slideNum = argv.s || argv.slide;
	} else {
		throw Error("No slide number was given!");
	}

	//load the powerpoint zip file
	loadZip(config);
}

async function loadZip(config: BuildOptions) {
	await ZipHandler.loadZip(config.powerpointFilePath);
	let slideShowGlobals = await ZipHandler.parseSlideAttributes("ppt/presentation.xml");
	let slideShowTheme = await ZipHandler.parseSlideAttributes("ppt/theme/theme1.xml");

	let slideSizeX = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cx"];
	let slideSizeY = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cy"];

	//Place elements in right position for HTML
	let slideAttributes = await ZipHandler.parseSlideAttributes(format("ppt/slides/slide{0}.xml", config.slideNum));
	let slideRelations = await ZipHandler.parseSlideAttributes(format("ppt/slides/_rels/slide{0}.xml.rels", config.slideNum)); //contains references to links,images and etc.
	console.log(JSON.stringify(slideAttributes));

	//Parse ppt/presentation.xml and get size
	let scaler = new GridScaler(slideSizeX, slideSizeY, 12);
	let htmlGen = new HTMLGenerator(config.PositionType);
	let pptElementParser = new PowerpointElementParser(slideShowGlobals, slideShowTheme, slideRelations);

	let slideShapes = slideAttributes["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:sp"] || [];
	let slideImages = slideAttributes["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:pic"] || [];

	let slideElements = slideShapes.concat(slideImages);
	let elementsCSS = [];

	for (let element of slideElements) {
		//parse element body
		let pptElement = pptElementParser.getProcessedElement(element);

		if (pptElement) {
			console.log(pptElement);
			let rendererType = pptElement.specialityType == SpecialityType.None ? pptElement.shapeType : pptElement.specialityType; //set the renderer type dynamically
			console.log(rendererType);
			//Convert PPT shapes
			let renderedElement = new ShapeRenderers[rendererType](scaler, pptElement, slideShowGlobals, slideShowTheme, config.PositionType);
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
