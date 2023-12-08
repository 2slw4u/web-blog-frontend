import { PageLoader } from "./PageLoader.js";

export class MainPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/main-page-template.html");
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}