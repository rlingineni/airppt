import ElementRenderer from "@renderers/renderer";
import GridScaler from "gridscalerts";
import { PowerpointElement } from "@models/pptelement";
import * as format from "string-template";
import { PositionType } from "@models/css";

export default class Textbox extends ElementRenderer {
	constructor(scaler: GridScaler, element: PowerpointElement, rawSlideShowGlobals, rawSlideShowTheme, PositionType: PositionType) {
		super(scaler, element, rawSlideShowGlobals, rawSlideShowTheme, PositionType);
		let css = format(
			`#{name}.shape{
            width:{width}px;
            height:{height}px;    
            background: #{background}; 
            }`,
			{
				name: element.name,
				width: scaler.getScaledValue(element.elementOffsetPosition.cx),
				height: scaler.getScaledValue(element.elementOffsetPosition.cy),
				background: element.shape.fillColor
			}
		);
		this.addCSSAttribute(css);
	}

	render(): string {
		let shapeDiv = format('<div id="{0}" class="{1}"> </div>', this.element.name, "position shape");
		this.$("body").append(shapeDiv); //add the shapediv initially

		if (this.element.paragraph) {
			let inputHTML = format('<input class="font" placeholder="{0}" style="width:100%; height:100%"/>', this.element.paragraph.text);
			this.$("#" + this.element.name).append(inputHTML);
		}

		return this.$("#" + this.element.name)[0].outerHTML;
		return "Textbox";
	}
}
