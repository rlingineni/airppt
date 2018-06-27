"use strict";
/**
 * Generates HTML output and adds relevant classes to elements
 */
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom = require("jsdom");
const format = require("string-template");
const beautify = require("beautify");
const jquery = require("jquery");
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
    addElementToDOM(elementName, elementProperties) {
        /**
         * <div class="one">1</div>
         */
        let elementHTML = format('<div id="{0}" class="{1}" style="background-color:red"> </div>', elementName, "position style font");
        this.$("#layout").append(elementHTML);
    }
    getGeneratedHTML() {
        return beautify(this.window.document.documentElement.outerHTML, { format: 'html' });
    }
}
exports.default = HTMLGenerator;
