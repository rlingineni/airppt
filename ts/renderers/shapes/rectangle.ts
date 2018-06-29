import { PowerpointElement } from "@models/pptelement";
import GridScaler from "gridscalerts";
import * as format from "string-template";

/**
 * Takes in an element and it's attributes to generate a rectangle and places elements in correct place. The scaler can help you convert heights and widths.
 * Raw GlobalXML values are passed in for reference such as theme.xml and presentation.xml
 */
export default function Rectangle(scaler: GridScaler, element: PowerpointElement, rawSlideShowGlobals, rawSlideShowTheme) {
	//NOTE: We don't have to worry about width and height, our positioner takes care of that for us
	let css = format(
		`#{name}.shape{
        width:{width}px;
        height:{height}px;    
        background: #{background}; 
        }`,
		{
			name: element.name,
			width: scaler.getScaledValue(element.elementOffsetPosition.cx),
			height: scaler.getScaledValue(element.elementOffsetPosition.cy),
			background: element.shape.fillColor
		}
	);

	return css;
}
