import GridScaler from "gridscalerts";
import { PowerpointElement } from "@models/pptelement";

abstract class ElementRenderer {
	private elementCSS = [];
	private elementHTML = [];

	constructor(private scaler: GridScaler, private element: PowerpointElement, private rawSlideShowGlobals, private rawSlideShowTheme) {
		this.generateElementAbsolutePosition();
		//this.generateElementGridPosition();
	}

	generateParagraphCSS(): string {
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
	private generateElementGridPosition() {}

	public generateCSSfromObject(obj: any) {
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

	public abstract getHTML(): string;
	public getCSS(): string {
		return this.elementCSS.join("");
	}
	public addCSSElement(css: string): void {
		this.elementCSS.push(css); //add the new css object
	}
}

export default ElementRenderer;
