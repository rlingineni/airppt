import { CheckValidObject as checkPath } from "@helpers/checkobj";
import { PowerpointElement, ElementType, TextAlignment, FontAttributes, SpecialityType } from "@models/pptelement";

export default class ShapeParser {
	public static determineShapeType(prst): ElementType {
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

	public static determineSpecialityType(element): SpecialityType {
		if (checkPath(element, '["p:nvSpPr"][0]["p:cNvSpPr"][0]["$"]["txBox"]') == 1) {
			console.log("is textbox");
			return SpecialityType.Textbox;
		}

		return SpecialityType.None;
	}
}
