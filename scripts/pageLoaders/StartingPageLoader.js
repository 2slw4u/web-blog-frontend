import {PageLoader} from "./PageLoader.js"
import { changeAuthorizedDisplay } from "../common.js";

export class StartingPageLoader  extends PageLoader {
    pathname = "../../index.html";

    //Это - единственный наследник PageLoader, имеющий нестандартное поведение: он ничего не подгружает в <content>
    loadPage() {
        $("#pageContent").empty();
        changeAuthorizedDisplay();
        super.displayCertainElements();
    }
}