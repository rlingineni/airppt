import ElementRenderer from "@renderers/renderer";
import GridScaler from "gridscalerts";
import { PowerpointElement } from "@models/pptelement";
import * as format from "string-template";
import { PositionType } from "@models/css";
import copyAssetToOutputDirectory from "../helpers/assetMover";
import { error } from "util";

export default class Image extends ElementRenderer {
	constructor(scaler: GridScaler, element: PowerpointElement, rawSlideShowGlobals, rawSlideShowTheme, PositionType: PositionType) {
		super(scaler, element, rawSlideShowGlobals, rawSlideShowTheme, PositionType);
		let css = format(
			`#{name}.shape{
            width:{width}px;
            height:{height}px;    
            }`,
			{
				name: element.name,
				width: scaler.getScaledValue(element.elementOffsetPosition.cx),
				height: scaler.getScaledValue(element.elementOffsetPosition.cy)
			}
		);
		this.addCSSAttribute(css);
		copyAssetToOutputDirectory(this.element.links.Uri, true); //also convert tiff to png
	}

	render(): string {
		let imagePath = this.getOutputImagePath(this.element.links.Uri);

		return format('<img id="{0}" src="{1}" class="position shape">', this.element.name, imagePath);
	}
}
