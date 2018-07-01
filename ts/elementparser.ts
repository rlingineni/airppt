import { PowerpointElement, ElementType, TextAlignment, FontAttributes, SpecialityType } from "@models/pptelement";
import { CheckValidObject as checkPath } from "@helpers/checkobj";

class PowerpointElementParser {
	private slideShowGlobals;
	private slideShowTheme;
	private element;

	constructor(slideShowGlobals, slideShowTheme) {
		this.slideShowGlobals = slideShowGlobals;
		this.slideShowTheme = slideShowTheme;
	}

	public getProcessedElement(rawElement): PowerpointElement {
		this.element = rawElement;
		let elementName: string =
			this.element["p:nvSpPr"][0]["p:cNvPr"][0]["$"]["title"] || this.element["p:nvSpPr"][0]["p:cNvPr"][0]["$"]["name"].replace(/\s/g, "");

		//elements must have a position, or else skip them TO-DO: Allow Placeholder positions
		if (!this.element["p:spPr"][0]["a:xfrm"]) {
			return null;
		}
		console.log(elementName);
		let elementPosition = this.element["p:spPr"][0]["a:xfrm"][0]["a:off"][0]["$"];
		let elementPresetType = this.element["p:spPr"][0]["a:prstGeom"][0]["$"]["prst"];
		let elementOffsetPosition = this.element["p:spPr"][0]["a:xfrm"][0]["a:ext"][0]["$"];

		let paragraphInfo = this.element["p:txBody"][0]["a:p"][0];
		let pptElement: PowerpointElement = {
			name: elementName,
			shapeType: this.determineShapeType(elementPresetType),
			speciality: this.determineSpecialityType(this.element),
			elementPosition: {
				x: elementPosition.x,
				y: elementPosition.y
			},
			elementOffsetPosition: {
				cx: elementOffsetPosition.cx,
				cy: elementOffsetPosition.cy
			},
			paragraph: this.extractParagraphElements(paragraphInfo),
			shape: {
				fillColor: this.getShapeFillColor(this.element) || "FFFFFF"
				//TO-DO Add Border Element
			},
			raw: rawElement
		};

		return pptElement;
	}

	private extractParagraphElements(textElement): PowerpointElement["paragraph"] {
		if (!textElement["a:r"]) {
			return null;
		}

		let pptTextElement: PowerpointElement["paragraph"] = {
			text: textElement["a:r"][0]["a:t"].toString() || "",
			textCharacterProperties: this.determineTextProperties(checkPath(textElement, '["a:r"][0]["a:rPr"][0]')),
			paragraphProperties: this.determineParagraphProperties(checkPath(textElement, '["a:pPr"][0]'))
		};
		return pptTextElement;
	}

	/**a:rPr */
	private determineTextProperties(textProperties): PowerpointElement["paragraph"]["textCharacterProperties"] {
		if (!textProperties) {
			return null;
		}

		let textPropertiesElement: PowerpointElement["paragraph"]["textCharacterProperties"] = {
			size: checkPath(textProperties, '["$"].sz') || 12,
			fontAttributes: this.determineFontAttributes(textProperties["$"]),
			font: checkPath(textProperties, '["a:latin"][0]["$"]["typeface"]') || "Helvetica",
			fillColor: this.getTextColors(textProperties) || "#000000"
		};

		return textPropertiesElement;
	}
	/** Parse for italics, bold, underline */
	private determineFontAttributes(attributesList): FontAttributes[] {
		let attributesArray: FontAttributes[] = [];
		if (!attributesList) {
			return null;
		}
		Object.keys(attributesList).forEach(element => {
			if (element == "b" && attributesList[element] == 1) {
				attributesArray.push(FontAttributes.Bold);
			}
			if (element == "i" && attributesList[element] == 1) {
				attributesArray.push(FontAttributes.Italics);
			}
			if (element == "u" && attributesList[element] == 1) {
				attributesArray.push(FontAttributes.Underline);
			}
			if (element == "s" && attributesList[element] == 1) {
				attributesArray.push(FontAttributes.StrikeThrough);
			}
		});
		return attributesArray;
	}

	/**a:pPr */
	private determineParagraphProperties(paragraphProperties): PowerpointElement["paragraph"]["paragraphProperties"] {
		if (!paragraphProperties) {
			return null;
		}
		let alignment: TextAlignment = TextAlignment.Left;
		if (paragraphProperties["$"]["algn"]) {
			switch (paragraphProperties["$"]["algn"]) {
				case "ctr":
					alignment = TextAlignment.Center;
					break;
				case "l":
					alignment = TextAlignment.Left;
					break;
				case "r":
					alignment = TextAlignment.Right;
					break;
				case "j":
					alignment = TextAlignment.Justified;
					break;
				default:
					alignment = TextAlignment.Left;
					break;
			}
		}
		console.log("align", alignment);
		let paragraphPropertiesElement: PowerpointElement["paragraph"]["paragraphProperties"] = {
			alignment
		};

		return paragraphPropertiesElement;
	}

	private getShapeFillColor(element): string {
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

	private getTextColors(textElement): string {
		if ("a:solidFill" in textElement) {
			return (
				checkPath(textElement, '["a:solidFill"]["0"]["a:srgbClr"]["0"]["$"]["val"]') ||
				this.getThemeColor(checkPath(textElement, '["a:solidFill"]["0"]["a:schemeClr"]["0"]["$"]["val"]')) ||
				"000000"
			);
		}
	}

	private getThemeColor(themeClr) {
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

	private determineShapeType(prst): ElementType {
		switch (prst) {
			case "rect":
				return ElementType.Rectangle;
			case "ellipse":
				return ElementType.Ellipse;
			case "roundRect":
				return ElementType.RoundedRectangle;
			case "triangle":
				return ElementType.Triangle;
			case "rtTriangle":
				return ElementType.RightTriangle;
			case "octagon":
				return ElementType.Octagon;
			case "frame":
				return ElementType.Frame;
			default:
				return ElementType.Rectangle;
		}
	}

	private determineSpecialityType(element): SpecialityType {
		if (checkPath(element, '["p:nvSpPr"][0]["p:cNvSpPr"][0]["$"]["txBox"]') == 1) {
			console.log("is textbox");
			return SpecialityType.Textbox;
		}

		return SpecialityType.None;
	}
}

export default PowerpointElementParser;
