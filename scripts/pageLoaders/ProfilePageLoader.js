import { PageLoader } from "./PageLoader.js";

export class ProfilePageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/profile-page-template.html");
    }

    saveUserId() {
        this.Controller.accountInfo().then((response) => {
            return response.json();
        }).then((json) => {
            localStorage.setItem("userId", json.id);
            localStorage.setItem("userEmail", json.email);
        })
    }

    loadPage(element = "body") {
        super.loadPage(element);
        this.saveUserId();
    } 
}