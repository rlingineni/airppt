import { PowerpointElement, ElementType, TextAlignment, FontAttributes, SpecialityType } from "@models/pptelement";
import { CheckValidObject as checkPath } from "@helpers/checkobj";
import ColorParser from "./colorparser";
import ShapeParser from "./shapeparser";
import ParagraphParser from "./paragraphparser";
import SlideRelationsParser from "./relparser";
import LineParser from "./lineparser";

class PowerpointElementParser {
	private element;

	constructor(private slideShowGlobals, slideShowTheme, private slideRelations) {
		ColorParser.setSlideShowTheme(slideShowTheme);
		SlideRelationsParser.setSlideRelations(slideRelations);
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
			shapeType: ShapeParser.determineShapeType(elementPresetType),
			speciality: ShapeParser.determineSpecialityType(this.element),
			elementPosition: {
				x: elementPosition.x,
				y: elementPosition.y
			},
			elementOffsetPosition: {
				cx: elementOffsetPosition.cx,
				cy: elementOffsetPosition.cy
			},
			paragraph: ParagraphParser.extractParagraphElements(paragraphInfo),
			shape: {
				fillColor: ColorParser.getShapeFillColor(this.element) || "FFFFFF",
				border: LineParser.extractLineElements(this.element)
			},
			raw: rawElement
		};

		return pptElement;
	}
}

export default PowerpointElementParser;
