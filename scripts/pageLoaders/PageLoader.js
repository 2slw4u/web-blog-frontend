import * as Common from "../common.js";

export class PageLoader {
    pathName = "";

    async hideAll() {
        for (let elementClass in Common.CommonElementClasses) {
            Common.changeDisplayOfElements(Common.CommonElementClasses[elementClass], Common.Enabling.disable);
        }
    }

    async displayElements(classes) {
        for (let elementClass in classes) {
            Common.changeDisplayOfElements(Common.CommonElementClasses[elementClass], Common.Enabling.enable);
        }
    }
    
    //Стандартное поведение - загрузка всего нужного в <content> страницы
    async loadPage(element = "body") {
        $("#pageContent").empty();
        let temp = document.createElement("div");
        $(temp).load(this.pathname, () => {
            $("#pageContent").append(temp.firstElementChild);
        });
        this.hideAll();
        Common.changeAuthorizedDisplay();
        $(element).scroll(0, 0, "smooth");
    }
}