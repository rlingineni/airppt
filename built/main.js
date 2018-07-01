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
const JSZip = require("jszip");
const fs = require("fs");
const xml2js = require("xml2js-es6-promise");
const gridscalerts_1 = require("./gridscalerts");
const cssgenerator_1 = require("@generators/cssgenerator");
const htmlgenerator_1 = require("@generators/htmlgenerator");
const elementparser_1 = require("./parsers/elementparser");
const filewriter_1 = require("@generators/filewriter");
const ShapeRenderers = require("@renderers/shapes");
const pptelement_1 = require("@models/pptelement");
const css_1 = require("@models/css");
loadZip();
function loadZip() {
    return __awaiter(this, void 0, void 0, function* () {
        var zip = new JSZip();
        let data = yield getData("../TeluguApp.pptx");
        let zipResult = yield zip.loadAsync(data);
        let slideShowGlobals = yield parseSlideAttributes(zipResult, "ppt/presentation.xml");
        let slideShowTheme = yield parseSlideAttributes(zipResult, "ppt/theme/theme1.xml");
        let slideSizeX = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cx"];
        let slideSizeY = slideShowGlobals["p:presentation"]["p:sldSz"][0]["$"]["cy"];
        let pptElementParser = new elementparser_1.default(slideShowGlobals, slideShowTheme);
        //Parse ppt/presentation.xml and get size
        let scaler = new gridscalerts_1.default(slideSizeX, slideSizeY, 12);
        let htmlGen = new htmlgenerator_1.default();
        //Place elements in right position for HTML
        let slideAttributes = yield parseSlideAttributes(zipResult, "ppt/slides/slide2.xml");
        console.log(JSON.stringify(slideAttributes));
        let slideElements = slideAttributes["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:sp"];
        let elementsCSS = [];
        for (let element of slideElements) {
            //parse element body
            let pptElement = pptElementParser.getProcessedElement(element);
            if (pptElement) {
                console.log(pptElement);
                let rendererType = pptElement.speciality == pptelement_1.SpecialityType.None ? pptElement.shapeType : pptElement.speciality;
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
        filewriter_1.default("abs.css", cssgenerator_1.default.generateCSS(css_1.PositionType.Absolute, elementsCSS));
        filewriter_1.default("grid.css", cssgenerator_1.default.generateCSS(css_1.PositionType.Grid, elementsCSS));
        filewriter_1.default("index.html", htmlGen.getGeneratedHTML());
    });
}
function parseSlideAttributes(zipResult, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let presentationSlide = yield zipResult.file(fileName).async("string");
        let parsedPresentationSlide = yield xml2js(presentationSlide, { trim: true });
        return parsedPresentationSlide;
    });
}
function getData(fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}
