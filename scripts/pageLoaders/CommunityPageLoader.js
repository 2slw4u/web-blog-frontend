import { PageLoader } from "./PageLoader.js";
import Common from "../startingPage.js";
import { ApiController } from "../api/ApiController.js";
import { MainPageLoader } from "./MainPageLoader.js";
import { MakePostPageLoader } from "./MakePostPageLoader.js";

export class CommunityPageLoader extends PageLoader {

    thisGroupId = null;

    constructor(groupId) {
        super("../../source/templates/page-templates/community-page-template.html");
        this.thisGroupId = groupId;
    }

    loadNavElements() {
        PageLoader.displayElements([".main-nav-item", ".authors-nav-item"]);
    }

    loadAdmins(json) {
        json.administrators.forEach(element => {
            $.get("../../source/templates/element-templates/group-admin-template.html", null, function (data) {
                let $template = $(data).clone();
                $template.find(".admin-nickname").text(element.fullName);
                let adminIconSourse = element.gender === 'Male'? "../../source/images/male-avatar-icon.svg" : "../../source/images/female-avatar-icon.svg";
                $template.find(".admin-avatar").attr("src", adminIconSourse);
                $(`#Group-detailed-${json.id} > .group-admins`).append($template);
            })
        });
    }

    formBody(page) {
        let body = {
            tag: $("#tag-filter").val().length == 0 ? null : $("#tag-filter").val(),
            sorting: $("#sort-filter").val(),
            page: page,
            size: $("#post-pagination-size").val()
        };
        return body;
    }

    loadContent(groupInfo, role = null) {
        let _makePostPageLoader = new MakePostPageLoader();
        _makePostPageLoader.loadTags("#tag-filter");
        if (role == Common.default.CommunityRoles.subscriber || groupInfo.isClosed == false) {
            let _mainPageLoader = new MainPageLoader();
            $("#action-apply-filters").click(async () => {
                _mainPageLoader.loadPosts(this.formBody(1), "#filters-form", Common.default.NewElementPosition.after, this.thisGroupId);
            });
            _mainPageLoader.loadPagination();
            Common.waitForElm("#post-pagination-size").then(() => {
                _mainPageLoader.loadPosts(this.formBody(1), "#filters-form", Common.default.NewElementPosition.after, this.thisGroupId);
            });
        }
    }

    loadGroup() {
        this.Controller.communityInfo(this.thisGroupId).then((response) => {
            return response.json();
        }).then((json) => {
            $.get("../../source/templates/element-templates/group-detailed-template.html", null, function (data) {
                let $template = $(data).clone();
                $template.attr("id", `Group-detailed-${json.id}`);
                if (json.isClosed == true) {
                    $template.find("#community-type").text("закрытое");
                }
                else {
                    $template.find("#community-type").text("открытое");
                }
                $template.find("#group-name").text(json.name);
                $template.find("#followers-amount").text(json.subscribersCount);
                $("#pageContent").prepend($template);
            })
            return json;
        }).then((json) => {
            this.loadAdmins(json);
            return json
        }).then((groupInfo) => {
            if (localStorage.getItem("token") != "null") {
                this.Controller.communityUsersRole(this.thisGroupId).then((response) => {
                    return response.json();
                }).then((json) => {
                    this.loadContent(groupInfo, json);
                    switch (json) {
                        case Common.default.CommunityRoles.admin:
                            $("#action-create-post").removeClass("d-none");
                            $("#action-create-post").click(() => {
                                /* let _makePostPageLoader = new MakePostPageLoader(this.thisGroupId);
                                _makePostPageLoader.loadPage(); */
                            });
                            break;
                        case Common.default.CommunityRoles.subscriber:
                            $("#action-unsubscribe").removeClass("d-none");
                            $("#action-unsubscribe").click(() => {
                                this.Controller.communityUnsubscribe(this.thisGroupId).catch((error) => {
                                    console.error(error);
                                    return error;
                                })
                                this.loadPage();
                            });
                            break;
                        default:
                            $("#action-subscribe").removeClass("d-none");
                            $("#action-subscribe").click(() => {
                                this.Controller.communitySubscribe(this.thisGroupId).catch((error) => {
                                    console.error(error);
                                    return error;
                                })
                                this.loadPage();
                            });
                            break;
                    }
                })
            } 
            else {
                this.loadContent(groupInfo);
            }
        })

    }

    loadElements() {
        this.loadGroup();
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}