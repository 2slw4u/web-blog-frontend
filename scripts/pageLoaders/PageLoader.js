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

    static displayElements(selectors) {
        selectors.forEach((selector) => {
            Common.changeDisplayOfElements(selector, Common.Enabling.enable);
        })
    }
    
    loadElements() {

    }

    loadNavElements() {

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
    async loadPage(scrollToElement = "body", animationTime = 1000) {
        return new Promise(async() => {
            $("#pageContent").empty();
            $.get(this.pathName, null, function(data){
                var $template = $(data).clone();
                $template.attr("id", "pageContent");
                $("#pageContent").replaceWith($template);
                PageLoader.hideAll();
                Common.changeAuthorizedDisplay();
            }).then(() => {
                this.loadNavElements();
                this.loadElements();
            })
            await Common.waitForElm(scrollToElement).then(() => {
                $('html, body').animate({
                    scrollTop: $(scrollToElement).offset().top
                }, animationTime);
            });
        });
    }
}
