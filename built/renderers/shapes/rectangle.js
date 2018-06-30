"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderer_1 = require("@renderers/renderer");
const format = require("string-template");
/**
 * Takes in an element and it's attributes to generate a rectangle and places elements in correct place. The scaler can help you convert heights and widths.
 * Raw GlobalXML values are passed in for reference such as theme.xml and presentation.xml
 */
class Rectangle extends renderer_1.default {
    //NOTE: We don't have to worry about width and height, our positioner takes care of that for us
    constructor(scaler, element, rawSlideShowGlobals, rawSlideShowTheme, PositionType) {
        super(scaler, element, rawSlideShowGlobals, rawSlideShowTheme, PositionType);
        let css = format(`#{name}.shape{
            width:{width}px;
            height:{height}px;    
            background: #{background}; 
            }`, {
            name: element.name,
            width: scaler.getScaledValue(element.elementOffsetPosition.cx),
            height: scaler.getScaledValue(element.elementOffsetPosition.cy),
            background: element.shape.fillColor
        });
        let textCSS = this.generateGenericParagraphCSS(element.name);
        this.addCSSAttribute(css);
    }
    render() {
        return "rectangle";
    }
}
exports.default = Rectangle;
