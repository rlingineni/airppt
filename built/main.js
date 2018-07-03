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
const gridscalerts_1 = require("./gridscalerts");
const ziphandler_1 = require("@helpers/ziphandler");
const cssgenerator_1 = require("@generators/cssgenerator");
const htmlgenerator_1 = require("@generators/htmlgenerator");
const elementparser_1 = require("./parsers/elementparser");
const filewriter_1 = require("@generators/filewriter");
const ShapeRenderers = require("@renderers/index");
const pptelement_1 = require("@models/pptelement");
const css_1 = require("@models/css");
loadZip();
function loadZip() {
    return __awaiter(this, void 0, void 0, function* () {
        yield ziphandler_1.default.loadZip("../TeluguApp.pptx");
        let slideShowGlobals = yield ziphandler_1.default.parseSlideAttributes("ppt/presentation.xml");
        let slideShowTheme = yield ziphandler_1.default.parseSlideAttributes("ppt/theme/theme1.xml");
        let slideSizeX = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cx"];
        let slideSizeY = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cy"];
        //Place elements in right position for HTML
        let slideAttributes = yield ziphandler_1.default.parseSlideAttributes("ppt/slides/slide5.xml");
        let slideRelations = yield ziphandler_1.default.parseSlideAttributes("ppt/slides/_rels/slide5.xml.rels"); //contains references to links,images and etc.
        console.log(JSON.stringify(slideAttributes));
        //Parse ppt/presentation.xml and get size
        let scaler = new gridscalerts_1.default(slideSizeX, slideSizeY, 12);
        let htmlGen = new htmlgenerator_1.default(css_1.PositionType.Absolute);
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
                let rendererType = pptElement.specialityType == pptelement_1.SpecialityType.None ? pptElement.shapeType : pptElement.specialityType; //override with speciality choice
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
        filewriter_1.WriteOutputFile("abs.css", cssgenerator_1.default.generateCSS(css_1.PositionType.Absolute, elementsCSS));
        filewriter_1.WriteOutputFile("grid.css", cssgenerator_1.default.generateCSS(css_1.PositionType.Grid, elementsCSS));
        filewriter_1.WriteOutputFile("index.html", htmlGen.getGeneratedHTML());
    });
}
