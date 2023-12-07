import { PageLoader } from "./PageLoader.js";

export class MakePostPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/make-post-page-template.html");
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}