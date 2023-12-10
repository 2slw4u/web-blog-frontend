import { PageLoader } from "./PageLoader.js";
import Common from "../startingPage.js";
import { ApiController } from "../api/ApiController.js";

export class CommunitiesPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/communities-page-template.html");
    }

    loadNavElements() {
        PageLoader.displayElements([".main-nav-item"]);
    }

    handleErrors() {
        super.handleErrors();
    }

    loadGroup (element, index, role="placeholder") {
        $.get("../../source/templates/element-templates/community-template.html", null, function (data) {
            let $template = $(data).clone();
            let _apiController = new ApiController();
            let _communitiesPageLoader = new CommunitiesPageLoader();
            $template.attr("id", `Group${index}`);
            $template.find("#community-name").text(element.name);
            let $actionButton = $template.find("#community-action");
            $actionButton.attr("id", `Button${index}`)
            switch (role) {
                case Common.default.CommunityRoles.subscriber:
                    $actionButton.text("Отписаться");
                    $actionButton.addClass("btn-danger");
                    $actionButton.click(() => {
                        _apiController.communityUnsubscribe(element.id).catch((error) => {
                            console.error(error);
                            return error;
                        })
                        _communitiesPageLoader.loadPage(`#${$actionButton.attr("id")}`);
                    }) 
                    break;
                case Common.default.CommunityRoles.admin:
                    $actionButton.addClass("d-none");
                    break;
                case null:
                    $actionButton.text("Подписаться");
                    $actionButton.addClass("btn-primary");
                    $actionButton.click(() => {
                        _apiController.communitySubscribe(element.id).catch((error) => {
                            console.error(error);
                            return error;
                        })
                        _communitiesPageLoader.loadPage(`#${$actionButton.attr("id")}`);
                    }) 
                    break;
            }
            //CommunitiesPageLoader.setActions($actionButton, element.id);
            $("#pageContent").append($template);
        })
    }

    loadElements() {
        this.Controller.communityList().then((response) => {
            return response.json();
        }).then((json) => {
            json.sort((a,b) => {
                if (a.name.toString().toLowerCase() < b.name.toString().toLowerCase()) {
                    return -1;
                }
                if (a.name.toString().toLowerCase() > b.name.toString().toLowerCase()) {
                    return 1;
                }
                return 0;
            });
            json.forEach((element, index) => {
                if (localStorage.getItem("token") != "null") {
                    this.Controller.communityUsersRole(element.id).then((response) => {
                        return response.json();
                    }).then((role) => {
                        this.loadGroup(element, index, role);
                        return role;
                    }).catch((error) => {
                        this.handleErrors(error);
                        return error;
                    })
                }
                else {
                    this.loadGroup(element, index);
                }
            });
            return json;
        }).catch((error) => {
            this.handleErrors(error);
            return error;
        });
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}