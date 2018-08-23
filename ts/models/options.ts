import { PositionType } from "@models/css";

export interface BuildOptions {
	PositionType: PositionType;
	GridSize?: number;
	outputPath?: string;
	powerpointFilePath: string;
	slideNum: number;
}
