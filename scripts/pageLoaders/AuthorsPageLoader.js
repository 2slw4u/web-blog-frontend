import { PageLoader } from "./PageLoader.js";

export class AuthorsPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/authors-page-template.html");
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}