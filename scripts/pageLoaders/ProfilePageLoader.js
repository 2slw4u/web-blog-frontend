import { PageLoader } from "./PageLoader.js";
import * as Common from "../common.js";
import { Validator } from "../Validator.js";
import {MaskMaker} from "../MaskMaker.js"

export class ProfilePageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/profile-page-template.html");
    }
    validate(body) {
        let errors = new Array();
        errors.push(Validator.validateNickname(body.fullName, "#full-name-input"));
        errors.push(Validator.validateEmail(body.email, "#email-input"));
        errors.push(Validator.validateDOB(body.birthDate, "#dob-input"));
        errors.push(Validator.validatePhone(body.phoneNumber, "#tel-input"));
        return super.validate(errors);
    }

    handleErros(err) {
        super.handleErrors(err);
    }

    async editProfile() {
        var body = {
            email: $('#email-input').val(),
            fullName: $('#full-name-input').val(),
            birthDate: new Date($('#dob-input').val()),
            gender: $('#sex-input').val() === "Мужчина" ? "Male" : "Female",
            phoneNumber: $('#tel-input').val()
        }
        if (this.validate(body)) {
            await this.Controller.accountEditInfo(body).catch((error) => {
                this.handleErros(error);
                return error;
            });
        }
    }

    async loadProfileData() {
        var response = this.Controller.accountInfo().then((response) => {
            return response.json();
        }).then((json) => {
            $("#email-input").val(json.email);
            $("#full-name-input").val(json.fullName);
            $("#sex-input").val(json.gender);
            $("#dob-input").val(Common.convertDateToDateInput(json.birthDate));
            $("#tel-input").val(json.phoneNumber);
        }).catch((error) => {
            this.handleErros(error);
            return error;
        });
    }

    async loadElements() {
        await Common.waitForElm("#edit-profile-button").then((elm) => {
            $(elm).click(() => {
                this.editProfile();
            });
            this.loadProfileData();
            MaskMaker.applyPhoneMask("#tel-input");
        });
    }

    loadNavElements() {
        PageLoader.displayElements([".profile-nav-item"]);
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}