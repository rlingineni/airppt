"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const argv = require("optimist").default({ PositionType: "abs", slide: 1 }).argv;
const gridscalerts_1 = require("./gridscalerts");
const index_1 = require("@generators/index");
const ziphandler_1 = require("@helpers/ziphandler");
const elementparser_1 = require("./parsers/elementparser");
const ShapeRenderers = require("@renderers/index");
const pptelement_1 = require("@models/pptelement");
const css_1 = require("@models/css");
const format = require("string-template");
GenerateUI();
function GenerateUI() {
    let config = {
        PositionType: argv.PositionType,
        powerpointFilePath: "../TeluguApp.pptx",
        slideNum: argv.slide
    };
    if (argv.input || argv.i) {
        config.powerpointFilePath = "../" + (argv.input || argv.i);
    }
    else {
        throw Error("No input argument with name of powerpoint file was given");
    }
    if (argv.position || argv.p) {
        config.PositionType = argv.position || argv.p;
    }
    if (argv.slide || argv.s) {
        config.slideNum = argv.slide || argv.s;
    }
    else {
        throw Error("No slide number was given!");
    }
    if (config.PositionType === "abs") {
    }
    else if (config.PositionType === "grid") {
    }
    else {
        throw Error("Invalid element positioning type in arguements");
    }
    //do some stuff based on the
    loadZip(config);
}
exports.default = GenerateUI;
function loadZip(config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ziphandler_1.default.loadZip(config.powerpointFilePath);
        let slideShowGlobals = yield ziphandler_1.default.parseSlideAttributes("ppt/presentation.xml");
        let slideShowTheme = yield ziphandler_1.default.parseSlideAttributes("ppt/theme/theme1.xml");
        let slideSizeX = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cx"];
        let slideSizeY = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cy"];
        //Place elements in right position for HTML
        let slideAttributes = yield ziphandler_1.default.parseSlideAttributes(format("ppt/slides/slide{0}.xml", config.slideNum));
        let slideRelations = yield ziphandler_1.default.parseSlideAttributes(format("ppt/slides/_rels/slide{0}.xml.rels", config.slideNum)); //contains references to links,images and etc.
        console.log(JSON.stringify(slideAttributes));
        //Parse ppt/presentation.xml and get size
        let scaler = new gridscalerts_1.default(slideSizeX, slideSizeY, 12);
        let htmlGen = new index_1.HTMLGenerator(css_1.PositionType.Absolute);
        let pptElementParser = new elementparser_1.default(slideShowGlobals, slideShowTheme, slideRelations);
        let slideShapes = slideAttributes["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:sp"];
        let slideImages = slideAttributes["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:pic"];
        let slideElements = slideShapes.concat(slideImages);
        let elementsCSS = [];
        for (let element of slideElements) {
            //parse element body
            let pptElement = pptElementParser.getProcessedElement(element);
            if (pptElement) {
                console.log(pptElement);
                let rendererType = pptElement.specialityType == pptelement_1.SpecialityType.None ? pptElement.shapeType : pptElement.specialityType; //set the renderer type dynamically
                console.log(rendererType);
                //Convert PPT shapes
                let renderedElement = new ShapeRenderers[rendererType](scaler, pptElement, slideShowGlobals, slideShowTheme, css_1.PositionType.Absolute);
                let elementCSS = renderedElement.getCSS();
                let html = renderedElement.render();
                //add HTML and CSS to files
                elementsCSS.push(elementCSS);
                htmlGen.addElementToDOM(html);
            }
        }
        //Create Output HTML file
        index_1.WriteOutputFile("abs.css", index_1.CSSGenerator.generateCSS(css_1.PositionType.Absolute, elementsCSS));
        index_1.WriteOutputFile("grid.css", index_1.CSSGenerator.generateCSS(css_1.PositionType.Grid, elementsCSS));
        index_1.WriteOutputFile("index.html", htmlGen.getGeneratedHTML());
    });
}
