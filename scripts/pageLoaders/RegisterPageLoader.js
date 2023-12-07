import { PageLoader } from "./PageLoader.js";

export class RegisterPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/register-page-template.html");
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}