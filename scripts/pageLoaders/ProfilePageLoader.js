import { PageLoader } from "./PageLoader.js";

export class ProfilePageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/profile-page-template.html");
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}