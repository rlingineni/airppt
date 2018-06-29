import { PowerpointElement, ElementType, TextAlignment, FontAttributes } from "@models/pptelement";
import { CheckValidObject as checkPath } from "@helpers/checkobj";

class PowerpointElementParser {
	private slideShowAttributes;
	private element;

	constructor(slideShowGlobals) {
		this.slideShowAttributes = slideShowGlobals;
	}

	public getProcessedElement(rawElement): PowerpointElement {
		this.element = rawElement;
		let elementName: string =
			this.element["p:nvSpPr"][0]["p:cNvPr"][0]["$"]["title"] ||
			this.element["p:nvSpPr"][0]["p:cNvPr"][0]["$"]["name"].replace(/\s/g, "");
		let elementPosition = this.element["p:spPr"][0]["a:xfrm"][0]["a:off"][0]["$"];
		let elementPresetType = this.element["p:spPr"][0]["a:prstGeom"][0]["$"]["prst"];
		let elementOffsetPosition = this.element["p:spPr"][0]["a:xfrm"][0]["a:ext"][0]["$"];

		let paragraphInfo = this.element["p:txBody"][0]["a:p"][0];

		let pptElement: PowerpointElement = {
			name: elementName,
			type: this.determineObjectType(elementPresetType),
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
				fillColor: this.getSolidFillColor(this.element["a:solidFill"]) || "#FFFFFF"
				//TO-DO Add Border Element
			}
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
			paragraphProperties: this.determineParagraphProperties(checkPath(textElement, '["a:r"][0]["a:pPr"][0]'))
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
			fillColor: this.getSolidFillColor(textProperties["a:solidFill"]) || "#000000"
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
		console.log(paragraphProperties);
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

		let paragraphPropertiesElement: PowerpointElement["paragraph"]["paragraphProperties"] = {
			alignment
		};

		return paragraphPropertiesElement;
	}

	private getSolidFillColor(solidFillProperties): string {
		if (!solidFillProperties) {
			return null;
		}
		return checkPath(solidFillProperties, '["0"]["a:srgbClr"]["0"]["$"]["val"]') || "#FFFFFF"; //TO-DO: Handle if fill color is from theme
	}

	private determineObjectType(prst): ElementType {
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
}

export default PowerpointElementParser;
