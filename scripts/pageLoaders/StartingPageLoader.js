import {PageLoader} from "./PageLoader.js"
import * as Common from "../common.js";

export class StartingPageLoader  extends PageLoader {
    pathname = "../../index.html";

    //Это - единственный наследник PageLoader, имеющий нестандартное поведение: он ничего не подгружает в <content> и не показывает никакие данные, 
    async loadPage(element = "body") {
        $("#pageContent").empty();
        this.hideAll();
        Common.changeAuthorizedDisplay();
        $(element).scroll(0, 0, "smooth");
    }
}