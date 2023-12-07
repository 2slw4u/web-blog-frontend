import {PageLoader} from "./PageLoader.js"
import * as Common from "../common.js";
import { Validator } from "../Validator.js";
import { ProfilePageLoader } from "./ProfilePageLoader.js";
import {RegisterPageLoader} from "./RegisterPageLoader.js";

export class LoginPageLoader extends PageLoader {

    _profilePageLoader = new ProfilePageLoader();
    _registerPageLoader = new RegisterPageLoader(); 

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
            let enabling = Common.Enabling.enable;
            if (!element.success) {
                enabling = Common.Enabling.disable;
                flag = false;
            }
            Common.changeValidation(element.container, enabling, element.message);
        });
        return flag;
    }

    handleErros(err) {
        console.log(err);
        Common.changeValidation("#email-input", Common.Enabling.disable, "Not quite right email..");
        Common.changeValidation("#password-input", Common.Enabling.disable, "..or password");
    }

    loadPage(element = "body") {
        super.loadPage(element);
        Common.waitForElm(".btn-primary").then((elm) => {
            $(elm).click(() => {
                this.login();
            });
        });
    } 

    login() {
        var body = {
            email: $('#email-input').val(),
            password: $('#password-input').val()
        }
        if (this.validate(body)) {
            var response = this.Controller.accountLogin(body).then((response) => {
                return response.json();
            }).then((json) => {
                console.log(json);
                localStorage.setItem("token", json["token"]);
                this._profilePageLoader.loadPage();
            }).catch((error) => {
                this.handleErros(error);
                return error;
            });
        }
    }
}