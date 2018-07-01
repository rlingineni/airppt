import { CheckValidObject as checkPath } from "@helpers/checkobj";
import ColorParser from "./colorparser";
import { PowerpointElement, ElementType, TextAlignment, FontAttributes, SpecialityType } from "@models/pptelement";

export default class ParagraphParser {
	public static extractParagraphElements(textElement): PowerpointElement["paragraph"] {
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
	public static determineTextProperties(textProperties): PowerpointElement["paragraph"]["textCharacterProperties"] {
		if (!textProperties) {
			return null;
		}

		let textPropertiesElement: PowerpointElement["paragraph"]["textCharacterProperties"] = {
			size: checkPath(textProperties, '["$"].sz') || 12,
			fontAttributes: this.determineFontAttributes(textProperties["$"]),
			font: checkPath(textProperties, '["a:latin"][0]["$"]["typeface"]') || "Helvetica",
			fillColor: ColorParser.getTextColors(textProperties) || "#000000"
		};

		return textPropertiesElement;
	}

	/**a:pPr */
	public static determineParagraphProperties(paragraphProperties): PowerpointElement["paragraph"]["paragraphProperties"] {
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

	/** Parse for italics, bold, underline */
	public static determineFontAttributes(attributesList): FontAttributes[] {
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
}
