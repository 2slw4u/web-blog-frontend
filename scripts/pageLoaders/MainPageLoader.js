import { waitForElm } from "../common.js";
import { PageLoader } from "./PageLoader.js";

export class MainPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/main-page-template.html");
    }

    loadNavElements() {
        PageLoader.displayElements([".authors-nav-item"]);
    }

    async loadPage(element = "body") {
        await super.loadPage(element);
        await Common.waitForElm(".authors-nav-item").then((elm) => {
            PageLoader.displayElements([".authors-nav-item", "w"]);
        });
    } 
}