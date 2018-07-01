import { CheckValidObject as checkPath } from "@helpers/checkobj";
import { PowerpointElement, ElementType, TextAlignment, FontAttributes, SpecialityType } from "@models/pptelement";

export default class ColorParser {
	static slideShowTheme;
	/**
	 *
	 * @param theme Parsed XML with theme colors
	 */
	public static setSlideShowTheme(theme) {
		this.slideShowTheme = theme;
	}
	public static getShapeFillColor(element): string {
		//spPR takes precdence
		let shapeProperties = element["p:spPr"][0];
		if (shapeProperties["a:solidFill"]) {
			//determine if it is theme or solid fill
			return (
				checkPath(shapeProperties, '["a:solidFill"]["0"]["a:srgbClr"]["0"]["$"]["val"]') ||
				this.getThemeColor(checkPath(shapeProperties, '["a:solidFill"]["0"]["a:schemeClr"]["0"]["$"]["val"]')) ||
				"FFFFFF"
			);
		}

		//spPR[NOFILL] return null
		if (shapeProperties["a:noFill"]) {
			return "transparent";
		}

		//look at p:style for shape default theme values
		let shapeStyle = element["p:style"][0];
		return this.getThemeColor(checkPath(shapeStyle, '["a:fillRef"]["0"]["a:schemeClr"]["0"]["$"]["val"]')) || "FFFFFF";
	}

	public static getTextColors(textElement): string {
		if ("a:solidFill" in textElement) {
			return (
				checkPath(textElement, '["a:solidFill"]["0"]["a:srgbClr"]["0"]["$"]["val"]') ||
				this.getThemeColor(checkPath(textElement, '["a:solidFill"]["0"]["a:schemeClr"]["0"]["$"]["val"]')) ||
				"000000"
			);
		}
	}

	public static getThemeColor(themeClr) {
		if (!themeClr) {
			return null;
		}

		console.log("looking up theme clr");
		let colors = this.slideShowTheme["a:theme"]["a:themeElements"][0]["a:clrScheme"][0];
		let targetTheme = "a:" + themeClr;
		if (targetTheme in colors) {
			return colors[targetTheme][0]["a:srgbClr"][0]["$"]["val"];
		}

		return null;
	}
}
