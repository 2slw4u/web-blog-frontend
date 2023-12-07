import { ApiController } from "../api/ApiController.js";
import * as Common from "../common.js";

export class PageLoader {

    constructor(pathName) {
        this.pathName = pathName;
        this.Controller = new ApiController();
    }

    static hideAll() {
        for (let elementClass in Common.CommonElementClasses) {
            Common.changeDisplayOfElements(Common.CommonElementClasses[elementClass], Common.Enabling.disable);
        }
    }

    static displayElements(classes) {
        for (let elementClass in classes) {
            Common.changeDisplayOfElements(Common.CommonElementClasses[elementClass], Common.Enabling.enable);
        }
    }
    
    loadElements() {

    }

    handleErrors(err) {
        console.error(err);
    }

    validate(errors) {
        let flag = true;
        errors.forEach(element => {
            let enabling = Common.Enabling.enable;
            if (!element.success) {
                enabling = Common.Enabling.disable;
                flag = false;
            }
            Common.changeValidation(element.container, enabling, element.message);
        });
        return flag;
    }

    //Стандартное поведение - загрузка всего нужного в <content> страницы
    async loadPage(element = "body") {
        return new Promise(() => {
            $("#pageContent").empty();
            $.get(this.pathName, null, function(data){
                var $template = $(data).clone();
                $template.attr("id", "pageContent");
                $template.find(".button-primary").click(function(){
                    PageLoader.hideAll();
                });
                $("#pageContent").replaceWith($template);
                PageLoader.hideAll();
                Common.changeAuthorizedDisplay();
                $(element).scroll(0, 0, "smooth");
            });
        });
    }
}