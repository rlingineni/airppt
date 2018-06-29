"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const format = require("string-template");
/**
 * Takes in an element and it's attributes to generate a rectangle and places elements in correct place. The scaler can help you convert heights and widths.
 * Raw GlobalXML values are passed in for reference such as theme.xml and presentation.xml
 */
function Rectangle(scaler, element, rawSlideShowGlobals, rawSlideShowTheme) {
    //NOTE: We don't have to worry about width and height, our positioner takes care of that for us
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
    return css;
}
exports.default = Rectangle;
