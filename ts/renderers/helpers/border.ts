import { PowerpointElement } from "@models/pptelement";
import * as format from "string-template";
import GridScaler from "gridscalerts";

/**
 * Pass in a Text
 */
export default function GenerateBorderCSS(scaler: GridScaler, paragraph: PowerpointElement["paragraph"], elementName: string): string {
	let css = format(
		`#{name} .border{
        font-size:{size}px;
        font-family: "{font}", Times, serif;  
        color: #{fill}; 
		text-align:{alignment};
		vertical-align:middle;
		display: table-cell;
        }`,
		{
			name: elementName,
			size: paragraph.textCharacterProperties.size / 100,
			font: paragraph.textCharacterProperties.font,
			fill: paragraph.textCharacterProperties.fillColor,
			alignment: paragraph.paragraphProperties.alignment
		}
	);
	return css;
}