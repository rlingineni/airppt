/**
 * Generates HTML output and adds relevant classes to elements
 */

const jsdom = require('jsdom');
const format = require("string-template");
const beautify = require('beautify');
const { JSDOM } = jsdom;
const { window } = new JSDOM(`
<html>
<head>
    <link rel="stylesheet" type="text/css" href="abs.css">
</head>
    <body> 
    <div id="layout" class="wrapper">
    </div>
    </body>
</html>`
);
const $ = require('jquery')(window)



module.exports = { addElementToDOM, getGeneratedHTML }


function addElementToDOM(elementName, elementProperties) {

    /**
     * <div class="one">1</div>
     */
    let elementHTML = format('<div id="{0}" class="{1}" style="background-color:red"> </div>', elementName, "position style font");
    $("#layout").append(elementHTML);

}

function getGeneratedHTML() {


    return beautify(window.document.documentElement.outerHTML, { format: 'html' });

}