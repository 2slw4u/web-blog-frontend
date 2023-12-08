import {PageLoader} from "./PageLoader.js"
import * as Common from "../common.js";
import { MainPageLoader } from "./MainPageLoader.js";
import { LoginPageLoader } from "./LoginPageLoader.js";
import { MakePostPageLoader } from "./MakePostPageLoader.js";
import { AuthorsPageLoader } from "./AuthorsPageLoader.js";
import { CommunitiesPageLoader } from "./CommunitiesPageLoader.js";
import { ProfilePageLoader } from "./ProfilePageLoader.js";

export class StartingPageLoader extends PageLoader {
    _pageLoader = new PageLoader();
    _mainPageLoader = new MainPageLoader();
    _makePostPageLoader = new MakePostPageLoader();
    _authorsPageLoader = new AuthorsPageLoader();
    _communitiesPageLoader = new CommunitiesPageLoader();
    _loginPageLoader = new LoginPageLoader();
    _profilePageLoader = new ProfilePageLoader();

    constructor() {
        super("../../index.html");
    }

    handleErrors() {
        super.handleErrors();
    }

    logout() {
        var response = this.Controller.accountLogout().then((response) => {
            return response.json();
        }).then((json) => {
            localStorage.setItem("token", null);
            localStorage.setItem("userEmail", null);
            $("#pageContent").empty();
            this.loadNavElements();
        }).catch((error) => {
            this.handleErros(error);
            return error;
        });
    }

    loadNavElements() {
        PageLoader.hideAll();
        Common.changeAuthorizedDisplay();
    }

    setUpNav() {
        $("#nav-starting-page").click(() => {
            $("#pageContent").empty();
            this.loadNavElements();
        });
        $("#nav-main-page").click(() => {
            this._mainPageLoader.loadPage();
        });
        $("#nav-make-post-page").click(() => {
            this._makePostPageLoader.loadPage();
        });
        $("#nav-authors-page").click(() => {
            this._authorsPageLoader.loadPage();
        });
        $("#nav-communities-page").click(() => {
            this._communitiesPageLoader.loadPage();
        });
        $("#nav-login-page").click(() => {
            this._loginPageLoader.loadPage();
        });
        $("#nav-profile-page").click(() => {
            this._profilePageLoader.loadPage();
        });
        $("#nav-logout").click(() => {
            this.logout();
        });
    }

    //Это - единственный наследник PageLoader, имеющий нестандартное поведение: он ничего не подгружает в <content> и не показывает никакие данные, 
    loadPage(element = "body") {
        $("#pageContent").empty();
        this.setUpNav();
        this.loadNavElements();
        $(element).scroll(0, 0, "smooth");
    }
}