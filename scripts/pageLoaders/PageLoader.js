import * as Common from "../common.js";

export class PageLoader {
    pathname = "";

    displayCertainElements() {
        for (let elementClass in Common.CommonElementClasses) {
            Common.changeDisplayOfElements(elementClass.valueOf(), Common.Enabling.disable);
        }
    }
    
    //Стандартное поведение - загрузка всего нужного в <content> страницы
    loadPage() {
        $("#pageContent").empty();
        $("#pageContent").load(this.pathname);
        this.displayCertainElements();
        Common.changeAuthorizedDisplay();
    }


}