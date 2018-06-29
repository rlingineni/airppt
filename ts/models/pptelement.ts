export interface PowerpointElement {
	name: string; //or the name combined
	type: ElementType; //any preset types or others such as "images","textboxes","media"
	elementPosition: {
		//location to place the element
		x: number;
		y: number;
	};
	elementOffsetPosition: {
		cx: number;
		cy: number;
	};
	paragraph?: {
		text: string;
		textCharacterProperties: {
			fontAttributes: FontAttributes[];
			font: string;
			size: number;
			fillColor: string;
		};
		paragraphProperties: {
			alignment: TextAlignment;
		};
	};
	shape?: {
		border?: {
			thickness: number;
			color: string;
			type: BorderType;
			radius: number;
		};
		fillColor: string;
	};
	fontStyle?: {
		font: string;
		fontSize: number;
		fontColor: string;
	};
	links?: {
		//wherever or whichever element this might link do
	};
}

export enum ElementType {
	Ellipse = "Ellipse",
	RoundedRectangle = "RoundedRectangle",
	Rectangle = "Rectangle",
	Octagon = "Octagon",
	Frame = "Frame",
	Triangle = "Triangle",
	RightTriangle = "RightTriangle",
	Image = "Image",
	Textbox = "Textbox",
	Media = "Media"
}

export enum BorderType {
	dotted,
	dashed,
	solid,
	groove,
	ridge
}

export enum FontAttributes {
	Bold,
	Italics,
	Underline,
	StrikeThrough
}

export enum TextAlignment {
	Center,
	Left,
	Right,
	Justified
}
