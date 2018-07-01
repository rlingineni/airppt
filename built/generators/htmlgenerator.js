"use strict";
/**
 * Generates HTML output and adds relevant classes to elements
 */
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom = require("jsdom");
const beautify = require("beautify");
const jquery = require("jquery");
const format = require("string-template");
const css_1 = require("@models/css");
class HTMLGenerator {
    constructor(positionType) {
        let pos;
        if (positionType == css_1.PositionType.Absolute) {
            pos = "abs.css";
        }
        else {
            pos = "grid.css";
        }
        this.JSDOM = jsdom.JSDOM;
        this.window = new this.JSDOM(format(`
					<html>
					<head>
						<link rel="stylesheet" type="text/css" href="{0}">
					</head>
						<body> 
						<div id="layout" class="wrapper">
						</div>
						</body>
					</html>`, pos)).window;
        this.$ = jquery(this.window);
    }
    addElementToDOM(htmlString) {
        /**
         * <div class="one">1</div>
         */
        this.$("#layout").append(htmlString);
    }
    getGeneratedHTML() {
        return beautify(this.window.document.documentElement.outerHTML, { format: "html" });
    }
}
exports.default = HTMLGenerator;
