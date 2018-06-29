"use strict";
/**
 * Generates HTML output and adds relevant classes to elements
 */
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom = require("jsdom");
const format = require("string-template");
const beautify = require("beautify");
const jquery = require("jquery");
const pptelement_1 = require("@models/pptelement");
class HTMLGenerator {
    constructor() {
        this.JSDOM = jsdom.JSDOM;
        this.window = new this.JSDOM(`
        <html>
        <head>
            <link rel="stylesheet" type="text/css" href="abs.css">
        </head>
            <body> 
            <div id="layout" class="wrapper">
            </div>
            </body>
        </html>`).window;
        this.$ = jquery(this.window);
    }
    addElementToDOM(pptElement) {
        /**
         * <div class="one">1</div>
         */
        let elementHTML = format('<div id="{0}" class="{1}"> </div>', pptElement.name, "position shape");
        this.$("#layout").append(elementHTML);
        if (pptElement.speciality == pptelement_1.SpecialityType.Textbox) {
            let inputHTML = format('<input class="font" placeholder="{0}" style="width:100%; height:100%"/>', pptElement.paragraph.text);
            this.$("#" + pptElement.name).append(inputHTML);
            return;
        }
        if (pptElement.paragraph) {
            let paragraphHTML = format('<p class="font">{0}</p>', pptElement.paragraph.text);
            this.$("#" + pptElement.name).append(paragraphHTML);
        }
    }
    getGeneratedHTML() {
        return beautify(this.window.document.documentElement.outerHTML, { format: "html" });
    }
}
exports.default = HTMLGenerator;
