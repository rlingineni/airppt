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
		copyAssetToOutputDirectory(this.element.links.Uri, true);
	}

	render(): string {
		let imagePath = this.element.links.Uri.replace("ppt", "assets");
		let fileExtension = this.element.links.Uri.split(".").pop();
		if (fileExtension == "tiff") {
			imagePath = imagePath.replace(".tiff", ".png"); //tiffs are converted to pngs
		}

		return format('<img id="{0}" src="{1}" class="position shape">', this.element.name, imagePath);
	}
}
