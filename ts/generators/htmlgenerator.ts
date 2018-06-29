/**
 * Generates HTML output and adds relevant classes to elements
 */

import * as jsdom from "jsdom";
import * as format from "string-template";
import * as beautify from "beautify";
import * as jquery from "jquery";
import { PowerpointElement, SpecialityType } from "@models/pptelement";

class HTMLGenerator {
	private JSDOM;
	private window;
	private $;

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

	public addElementToDOM(pptElement: PowerpointElement) {
		/**
		 * <div class="one">1</div>
		 */

		let elementHTML = format('<div id="{0}" class="{1}"> </div>', pptElement.name, "position shape");
		this.$("#layout").append(elementHTML);

		if (pptElement.speciality == SpecialityType.Textbox) {
			let inputHTML = format('<input class="font" placeholder="{0}" style="width:100%; height:100%"/>', pptElement.paragraph.text);
			this.$("#" + pptElement.name).append(inputHTML);
			return;
		}

		if (pptElement.paragraph) {
			let paragraphHTML = format('<p class="font">{0}</p>', pptElement.paragraph.text);
			this.$("#" + pptElement.name).append(paragraphHTML);
		}
	}

	public getGeneratedHTML() {
		return beautify(this.window.document.documentElement.outerHTML, { format: "html" });
	}
}

export default HTMLGenerator;
