import { PowerpointElement } from "@models/pptelement";
import GridScaler from "gridscalerts";
import * as format from "string-template";

/**
 * Takes in an ppt element and it's attributes to generate a triangle and places elements in correct place
 * Raw GlobalXML values are passed in for reference such as theme.xml and presentation.xml
 */
export default function Triangle(scaler: GridScaler, element: PowerpointElement, rawSlideShowGlobals, rawSlideShowTheme) {
	let css = format(
		`#{name}.shape {
        width: 0;
        height: 0;
        border-top: {height}px solid transparent;
        border-left: {width}px solid #{background};
        border-bottom: {height}px solid transparent;
    }
    `,
		{
			name: element.name,
			width: scaler.getScaledValue(element.elementOffsetPosition.cx),
			height: scaler.getScaledValue(element.elementOffsetPosition.cy) / 2,
			background: element.shape.fillColor
		}
	);
	return css;
}
