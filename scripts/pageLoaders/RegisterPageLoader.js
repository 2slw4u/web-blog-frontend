import { Validator } from "../Validator.js";
import { PageLoader } from "./PageLoader.js";
import * as Common from "../common.js";
import { MaskMaker } from "../MaskMaker.js";
import { ProfilePageLoader } from "./ProfilePageLoader.js";

export class RegisterPageLoader extends PageLoader {

    _profilePageLoader = new ProfilePageLoader();

    constructor() {
        super("../../source/templates/page-templates/register-page-template.html");
    }

    validate(body) {
        let errors = new Array();
        errors.push(Validator.validateNickname(body.fullName, "#full-name-input"));
        errors.push(Validator.validatePassword(body.password, "#password-input"));
        errors.push(Validator.validateEmail(body.email, "#email-input"));
        errors.push(Validator.validateDOB(body.birthDate, "#dob-input"));
        errors.push(Validator.validatePhone(body.phoneNumber, "#tel-input"));
        return super.validate(errors);
    }

    handleErros(err) {
        super.handleErrors(err);
    }

    async loadElements() {
        await Common.waitForElm("#register-button").then((elm) => {
            $(elm).click(() => {
                this.register();
            });
        });
        await Common.waitForElm("#tel-input").then((elm) => {
            MaskMaker.applyPhoneMask(elm);
        });

    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 

    register() {
        var body = {
            fullName: $('#full-name-input').val(),
            password: $('#password-input').val(),
            email: $('#email-input').val(),
            birthDate: new Date($('#dob-input').val()),
            gender: $('#sex-input').val() == "Мужчина" ? "Male" : "Female",
            phoneNumber: $('#tel-input').val()
        }
        console.log(body);
        if (this.validate(body)) {
            var response = this.Controller.accountRegister(body).then((response) => {
                return response.json();
            }).then((json) => {
                localStorage.setItem("token", json["token"]);
                this._profilePageLoader.loadPage();
            }).catch((error) => {
                this.handleErros(error);
                return error;
            });
        }
    }
}