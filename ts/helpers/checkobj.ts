import * as format from "string-template";

export function CheckValidObject(obj: any, path: string): any {
	try {
		return eval(format("obj{0}", path));
	} catch (e) {
		return undefined;
	}
}
