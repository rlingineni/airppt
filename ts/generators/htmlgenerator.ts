/**
 * Generates HTML output and adds relevant classes to elements
 */

import * as jsdom from "jsdom";
import * as beautify from "beautify";
import * as jquery from "jquery";

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
