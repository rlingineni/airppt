"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pptelement_1 = require("@models/pptelement");
const renderer_1 = require("@renderers/renderer");
const format = require("string-template");
const paragraph_1 = require("../helpers/paragraph");
const assetMover_1 = require("../helpers/assetMover");
const border_1 = require("@renderers/helpers/border");
/**
 * Takes in an element and it's attributes to generate a rectangle and places elements in correct place. The scaler can help you convert heights and widths.
 * Raw GlobalXML values are passed in for reference such as theme.xml and presentation.xml
 */
class Rectangle extends renderer_1.default {
    //NOTE: We don't have to worry about positioning, our scaler and the base class takes care of that for us
    constructor(scaler, element, rawSlideShowGlobals, rawSlideShowTheme, PositionType) {
        super(scaler, element, rawSlideShowGlobals, rawSlideShowTheme, PositionType);
        let css = format(`#{name}.shape{
			width:{width}px;
			height:{height}px;  
			background: {background}; 
			display: table;
            }`, {
            name: element.name,
            width: scaler.getScaledValue(element.elementOffsetPosition.cx),
            height: scaler.getScaledValue(element.elementOffsetPosition.cy),
            background: this.determineBackground()
        });
        //stylize text in this element with a generic paragraph helper, may or may not work on all shapes
        if (element.paragraph) {
            let fontCSS = paragraph_1.default(element.paragraph, element.name);
            this.addCSSAttribute(fontCSS);
        }
        if (element.shape.border) {
            let borderCSS = border_1.default(element.shape.border, element.name);
            this.addCSSAttribute(borderCSS);
        }
        this.addCSSAttribute(css);
    }
    render() {
        //NOTE: I'm using JQUERY to build my dom, but you can return html however you want
        let shapeDiv = format(`<div id="{0}" class="{1}">
				<a style="height:100%;display:block;"> </a>
			</div>`, this.element.name, "position shape border");
        this.$("body").append(shapeDiv); //add the shapediv initially
        if (this.element.links) {
            if (this.element.links.Type == pptelement_1.LinkType.External) {
                this.$("#" + this.element.name + " > a").attr("href", this.element.links.Uri);
            }
        }
        if (this.element.paragraph) {
            let paragraphHTML = format('<p class="font">{0}</p>', this.element.paragraph.text);
            this.$("#" + this.element.name).append(paragraphHTML); //add the paragraph div within t
        }
        return this.$("#" + this.element.name)[0].outerHTML;
    }
    determineBackground() {
        if (this.element.shape.opacity == 0) {
            return "transparent";
        }
        let fillDetails = this.element.shape.fill;
        if (fillDetails.fillType == pptelement_1.FillType.Solid) {
            return "#" + this.element.shape.fill.fillColor;
        }
        if (fillDetails.fillType == pptelement_1.FillType.Image) {
            assetMover_1.default(fillDetails.fillColor, true);
            //change tiff references to pngs
            let imagePath = this.getOutputImagePath(fillDetails.fillColor);
            console.log("GOT Imagepath as ", imagePath);
            return format("url({0})", imagePath);
        }
        return "transparent";
    }
}
exports.default = Rectangle;
