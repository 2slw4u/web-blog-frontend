import {PageLoader} from "./PageLoader.js"
import * as Common from "../common.js";
import { Validator } from "../Validator.js";

export class LoginPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/login-page-template.html");
    }

    logging(obj) {
        console.log(obj);
    }

    validate(body) {
        let errors = new Array();
        errors.push(Validator.validateEmail(body.email, "#email-input"));
        errors.push(Validator.validatePassword(body.password, "#password-input"));
        let flag = true;
        errors.forEach(element => {
            if (element.message != "OK") {
                Common.changeValidation(element.container, Common.Enabling.disable, element.message);
                flag = false;
            }
            else {
                Common.changeValidation(element.container, Common.Enabling.enable, 'Кайф!');
            }
        });
        return flag;
    }

    loadPage(element = "body") {
        //let Controller = new ApiController();
        //let _startingPageLoader = new StartingPageLoader();
        super.loadPage(element);
        Common.waitForElm(".btn-primary").then((elm) => {
            $(elm).click(() => {
                var body = {
                    email: $('#email-input').val(),
                    password: $('#password-input').val()
                }
                if (this.validate(body)) {
                    var response = this.Controller.accountLogin(body).then((response) => {
                        return response.json();
                    }).then((json) => {
                        console.log(json);
                    }).catch((error) => {
                        console.log(error);
                        return error;
                    });
                }
            })
        })
        
    } 
}