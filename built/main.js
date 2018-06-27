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
const JSZip = require("jszip");
const fs = require("fs");
const xml2js = require("xml2js-es6-promise");
const gridscalerts_1 = require("./gridscalerts");
const layoutgenerator_1 = require("./generators/layoutgenerator");
const htmlgenerator_1 = require("./generators/htmlgenerator");
const filewriter_1 = require("./generators/filewriter");
loadZip();
function loadZip() {
    return __awaiter(this, void 0, void 0, function* () {
        var zip = new JSZip();
        let data = yield getData("../TeluguApp.pptx");
        let zipResult = yield zip.loadAsync(data);
        let slideShowAttributes = yield parseSlideAttributes(zipResult, 'ppt/presentation.xml');
        let slideSizeX = slideShowAttributes['p:presentation']['p:sldSz'][0]['$']['cx'];
        let slideSizeY = slideShowAttributes['p:presentation']['p:sldSz'][0]['$']['cy'];
        //TO-DO:
        //Parse ppt/presentation.xml and get size
        let scaler = new gridscalerts_1.default(slideSizeX, slideSizeY, 12);
        let layoutGen = new layoutgenerator_1.default();
        let htmlGen = new htmlgenerator_1.default();
        //Place elements in right position for HTML
        let slideAttributes = yield parseSlideAttributes(zipResult, 'ppt/slides/slide1.xml');
        let slideElements = slideAttributes["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:sp"];
        for (let element of slideElements) {
            //parse element body
            let elementName = element['p:nvSpPr'][0]['p:cNvPr'][0]['$']['title'] || element['p:nvSpPr'][0]['p:cNvPr'][0]['$']['name'];
            let elementPosition = element['p:spPr'][0]['a:xfrm'][0]['a:off'][0]['$'];
            let elementOffsetPosition = element['p:spPr'][0]['a:xfrm'][0]['a:ext'][0]['$'];
            layoutGen.generateElementCSS(scaler, elementName, elementPosition, elementOffsetPosition);
            htmlGen.addElementToDOM(elementName);
        }
        //console.log(layoutGen.getCSS('grid'));
        //console.log(layoutGen.getCSS('abs'));
        // console.log(JSON.stringify(slideAttributes));
        //Convert PPT shapes
        //Create Output HTML file
        //console.log(htmlGen.getGeneratedHTML())
        filewriter_1.default("abs.css", layoutGen.getCSS('abs'));
        filewriter_1.default("grid.css", layoutGen.getCSS('grid'));
        filewriter_1.default("index.html", htmlGen.getGeneratedHTML());
        /** Rezip file and Slides
        zip.file("ppt/slides/slide1.xml", xmlString)
        console.log(zipResult);
        console.log("done");
    
        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream('InteractivePPT-x.ppsm'))
            .on('finish', function () {
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
                console.log("out.zip written.");
            });
        */
    });
}
/**
 * Returns a PPT Element Object
 */
function extractElementAttributes() {
    //standardized object model
    return {
    /*  name: "NextLetterButton", //or the name combined
      type: "rect", //any preset types or others such as "images","textboxes","media"
      elementPostion: { //location to place the element
          x: 100000,
          y: 100000
      },
      elementOffsetPosition: {
          cx: 1000000,
          cy: 1000000,
      },
      value: "",
      visualStyle: {
          border: {
              thickness: 12,
              color: red,
              type: dashed,
              radius: 25,
          },
          fill: {
              color: blue,
          }
      },
      fontStyle: {
          font: 'Calibri',
          fontSize: '12',
          fontColor: '#FFF'
      },
      links: {
          //wherever or whichever element this might link do
      }*/
    };
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
