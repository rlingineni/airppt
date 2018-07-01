import { CheckValidObject as checkPath, CheckValidObject } from "@helpers/checkobj";

import { PowerpointElement, ElementType, TextAlignment, FontAttributes, SpecialityType, LinkType } from "@models/pptelement";
import { link } from "fs";

export default class SlideRelationsParser {
	static slideRels;
	/**
	 *
	 * @param theme Parsed XML with theme colors
	 */
	public static setSlideRelations(rels) {
		this.slideRels = rels;
	}

	public static resolveShapeHyperlinks(element): PowerpointElement["links"] {
		let relID = CheckValidObject(element, '["p:nvSpPr"][0]["p:cNvPr"][0]["a:hlinkClick"][0]["$"]["r:id"]');
		if (!relID) {
			return null;
		}
		let linkDetails = this.getRelationDetails(relID);
		return linkDetails;
	}

	public static getRelationDetails(relID): PowerpointElement["links"] {
		let relations = this.slideRels["Relationships"]["Relationship"];
		for (var relation of relations) {
			let relationDetails = relation["$"];
			if (relationDetails["Id"] == relID) {
				let linkType = LinkType.Asset;
				if (relationDetails["TargetMode"] && relationDetails["TargetMode"] === "External") {
					linkType = LinkType.External;
				}
				let relElement: PowerpointElement["links"] = {
					Type: linkType,
					Uri: relationDetails["Target"]
				};

				return relElement;
			}
		}

		return null;
	}
}
