/**
 * Generates HTML output and adds relevant classes to elements
 */

import * as jsdom from "jsdom";
import * as beautify from "beautify";
import * as jquery from "jquery";
import * as format from "string-template";
import { PositionType } from "@models/css";

class HTMLGenerator {
	private JSDOM;
	private window;
	private $;

	constructor(positionType: PositionType) {
		let pos: string;
		if (positionType == PositionType.Absolute) {
			pos = "abs.css";
		} else {
			pos = "grid.css";
		}
		this.JSDOM = jsdom.JSDOM;
		this.window = new this.JSDOM(
			format(
				`
					<html>
					<head>
						<link rel="stylesheet" type="text/css" href="{0}">
					</head>
						<body> 
						<div id="layout" class="wrapper">
						</div>
						</body>
					</html>`,
				pos
			)
		).window;
		this.$ = jquery(this.window);
	}

	public addElementToDOM(htmlString: string) {
		/**
		 * <div class="one">1</div>
		 */

		this.$("#layout").append(htmlString);
	}

	public getGeneratedHTML() {
		return beautify(this.window.document.documentElement.outerHTML, { format: "html" });
	}
}

export default HTMLGenerator;
