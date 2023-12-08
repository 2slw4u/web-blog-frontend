import { PageLoader } from "./PageLoader.js";

export class CommunityPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/community-page-template.html");
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}