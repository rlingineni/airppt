import GridScaler from "gridscalerts";
import { PowerpointElement } from "@models/pptelement";
import { PositionType } from "@models/css";

const beautify = require("beautify");

abstract class ElementRenderer {
	private elementCSS = [];
	private elementHTML = [];

	constructor(
		private scaler: GridScaler,
		private element: PowerpointElement,
		private rawSlideShowGlobals,
		private rawSlideShowTheme,
		positionType: PositionType
	) {
		if (positionType == PositionType.Absolute) {
			this.generateElementAbsolutePosition();
		} else {
			this.generateElementGridPosition();
		}
	}

	public getCSS(): string {
		return beautify(this.elementCSS.join(""), { format: "css" });
	}

	public abstract render(): string;

	protected generateGenericParagraphCSS(elementID): string {
		//does some default work
		return "css";
	}
	private generateElementAbsolutePosition() {
		let scaledPositionCoordinates = this.scaler.getScaledCoordinate({
			x: this.element.elementPosition.x,
			y: this.element.elementPosition.y
		});
		let cssPosition = {
			position: "absolute",
			top: scaledPositionCoordinates.y + "px",
			left: scaledPositionCoordinates.x + "px"
		};
		let elementStyleKey = "#" + this.element.name + ".position";
		let layoutStyle = {};
		layoutStyle[elementStyleKey] = cssPosition;
		let css = this.generateCSSfromObject(layoutStyle);
		this.elementCSS.push(css);
		return css;
	}

	private generateElementGridPosition() {
		let cssPosition = this.scaler.getElementGridPlacement(
			{
				x: this.element.elementPosition.x,
				y: this.element.elementPosition.y
			},
			{
				x: this.element.elementOffsetPosition.cx,
				y: this.element.elementOffsetPosition.cy
			}
		);
		let elementStyleKey = "#" + this.element.name + ".position";
		let layoutStyle = {};
		layoutStyle[elementStyleKey] = cssPosition;
		let css = this.generateCSSfromObject(layoutStyle);
		this.elementCSS.push(css);
		return css;
	}

	protected generateCSSfromObject(obj: any) {
		const selectors = Object.keys(obj);
		let css = selectors
			.map(selector => {
				const definition = obj[selector];
				const rules = Object.keys(definition)
					.map(rule => `${rule}:${definition[rule]}`)
					.join(";");
				return `${selector} {${rules}}`;
			})
			.join("");
		return css;
	}

	protected addCSSAttribute(css: string): void {
		this.elementCSS.push(css); //add the new css object
	}
}

export default ElementRenderer;
