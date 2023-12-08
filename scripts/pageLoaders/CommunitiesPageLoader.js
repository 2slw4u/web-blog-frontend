import { PageLoader } from "./PageLoader.js";

export class CommunitiesPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/communities-page-template.html");
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}