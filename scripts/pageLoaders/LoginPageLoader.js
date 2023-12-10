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

    validate(body) {
        let errors = new Array();
        errors.push(Validator.validateEmail(body.email, "#email-input"));
        errors.push(Validator.validatePassword(body.password, "#password-input"));
        return super.validate(errors);
    }

    handleErros(err) {
        super.handleErrors(err);
        Common.changeValidation("#email-input", Common.default.Enabling.disable, "Not quite right email..");
        Common.changeValidation("#password-input", Common.default.Enabling.disable, "..or password");
    }

    async loadElements() {
        await Common.waitForElm("#login-button").then((elm) => {
            $(elm).click(() => {
                this.login();
            });
        });
        await Common.waitForElm("#register-button").then((elm) => {
            $(elm).click(() => {
                this._registerPageLoader.loadPage();
            });
        });
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 

    login() {
        let body = {
            email: $('#email-input').val(),
            password: $('#password-input').val()
        }
        if (this.validate(body)) {
            return this.Controller.accountLogin(body).then((response) => {
                return response.json();
            }).then(async (json) => {
                localStorage.setItem("token", json["token"]);
                await localStorage.setItem("userEmail", body.email);
                this._profilePageLoader.loadPage();
            }).catch((error) => {
                this.handleErros(error);
                return error;
            });
        }
    }
}