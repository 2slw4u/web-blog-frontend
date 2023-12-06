import * as Common from "../common.js";

export class PageLoader {
    pathname = "";

    displayCertainElements() {
        for (let elementClass in Common.CommonElementClasses) {
            Common.changeDisplayOfElements(Common.CommonElementClasses[elementClass], Common.Enabling.disable);
        }
    }
    
    //Стандартное поведение - загрузка всего нужного в <content> страницы
    loadPage(element = "body") {
        $("#pageContent").load(this.pathname);
        this.displayCertainElements();
        Common.changeAuthorizedDisplay();
        $(element).scroll(0, 0, "smooth");
    }
}