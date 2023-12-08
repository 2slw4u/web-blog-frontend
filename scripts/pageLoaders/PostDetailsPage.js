import { PageLoader } from "./PageLoader.js";

export class PostDetailsPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/post-details-page-template.html");
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}