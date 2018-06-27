/**
 * Generates HTML output and adds relevant classes to elements
 */

import * as jsdom from 'jsdom';
import * as format from "string-template";
import * as beautify from 'beautify';
import * as jquery from 'jquery'


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
        </html>`
        ).window;
        this.$ = jquery(this.window);
    }


    public addElementToDOM(elementName: string, elementProperties?: any) {

        /**
         * <div class="one">1</div>
         */
        let elementHTML = format('<div id="{0}" class="{1}" style="background-color:red"> </div>', elementName, "position style font");
        this.$("#layout").append(elementHTML);

    }

    public getGeneratedHTML() {

        return beautify(this.window.document.documentElement.outerHTML, { format: 'html' });

    }

}

export default HTMLGenerator;