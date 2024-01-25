import { waitForElm } from "../common.js";
import { PageLoader } from "./PageLoader.js";
import {MakePostPageLoader} from "./MakePostPageLoader.js";
import { Validator } from "../Validator.js";
import * as Common from "../common.js";
import { PostDetailsPageLoader } from "./PostDetailsPage.js";

export class MainPageLoader extends PageLoader {


    constructor() {
        super("../../source/templates/page-templates/main-page-template.html");
        this._makePostPageLoader = new MakePostPageLoader();
        this._postDetailsPageLoader = new PostDetailsPageLoader();
        this.authorFilter = null;
    }

    handleErrors(err) {
        super.handleErrors(err);
    }

    validate(body) {
        let errors = new Array();
        errors.push(Validator.validateFilterReadingTime(body.min, "#reading-time-min"));
        errors.push(Validator.validateFilterReadingTime(body.max, "#reading-time-max"));
        return super.validate(errors);
    }

    loadNavElements() {
        PageLoader.displayElements([".main-nav-item", ".authors-nav-item"]);
    }

    loadActions() {
        $("#action-apply-filters").click(async () => {
            this.loadPosts(this.formBody(1), "#filters-form", Common.default.NewElementPosition.after);
        });
        $("#create-post-button").click(() => {
            $("#nav-make-post-page").trigger("click");
        });
        $("#author-filter").val(this.authorFilter);
    }

    uploadPagination(pagination, communityId = null) {
        console.log(pagination);
        $.get("../../source/templates/element-templates/post-pagination-template.html", null, function (data) {
            let $template = $(data).clone();
            $template = $template.find(".post-pagination-nav-template");
            $template.find("#pagination-basic-option > .page-link").text(pagination.current);
            if(pagination.current - 1 > 0) {
                let $pageBefore = $("#pagination-basic-option").clone();
                $pageBefore.attr("id", "pagination-before-basic-option");
                $pageBefore.find(".page-link").text(pagination.current - 1);
                $template.find("#pagination-basic-option").before($pageBefore);
            }
            if (pagination.current + 1 <= pagination.count) {
                let $pageAfter = $("#pagination-basic-option").clone();
                $pageAfter.attr("id", "pagination-after-basic-option");
                $pageAfter.find(".page-link").text(pagination.current + 1);
                $template.find("#pagination-basic-option").after($pageAfter);
            }
            $(".post-pagination-nav-template").replaceWith($template);
        }).then(() => {
            if (pagination.current - 1 > 0) {
                let $pageBefore = $("#pagination-before-basic-option");
                $pageBefore.click(() => {
                    this.loadPosts(this.formBody(Number($pageBefore.find(".page-link").text())), "#filters-form", Common.default.NewElementPosition.after, communityId);
                });
                $("#pagination-previous-item").click(() => {
                    this.loadPosts(this.formBody(pagination.current - 1), "#filters-form", Common.default.NewElementPosition.after, communityId);
                });
            }
            if (pagination.current + 1 <= pagination.count) {
                let $pageAfter = $("#pagination-after-basic-option");
                $pageAfter.click(() => {
                    this.loadPosts(this.formBody(Number($pageAfter.find(".page-link").text())), "#filters-form", Common.default.NewElementPosition.after, communityId);
                });
                $("#pagination-next-item").click(() => {
                    this.loadPosts(this.formBody(pagination.current + 1), "#filters-form", Common.default.NewElementPosition.after, communityId);
                });
            }
        });
    }

    loadPagination(groupId=null) {
        $.get("../../source/templates/element-templates/post-pagination-template.html", null, function (data) {
            let $template = $(data).clone();
            $("#pageContent").append($template);
        }).then(() => {
            $("#post-pagination-size").change(() => {
                this.loadPosts(this.formBody(1), "#filters-form", Common.default.NewElementPosition.after, groupId);
            })
        });
    }

    formBody(page) {
        let body = {
            tag: $("#tag-filter").val().length == 0 ? null : $("#tag-filter").val(),
            author: $("#author-filter").val() == "" ? null : $("#author-filter").val(),
            min: $("#reading-time-min").val() == "" ? null : $("#reading-time-min").val(),
            max: $("#reading-time-max").val() == "" ? null : $("#reading-time-max").val(),
            sorting: $("#sort-filter").val(),
            onlyMyCommunities: $("#include-only-users-groups-check").is(":checked") == false ? false : true,
            page: page,
            size: $("#post-pagination-size").val()
        };
        return body;
    }

    loadPosts(body, parentSelector, position, communityId=null) {
        if (communityId != null) {
            $(".post-template").remove();
            this.Controller.communityPosts(communityId, body).then((response) => {
                return response.json();
            }).then((json) => {
                console.log(json);
                json.posts.forEach(async post => {
                    await this._postDetailsPageLoader.loadPost(post, (`${parentSelector}`), false, position);
                });
                this.uploadPagination(json.pagination, communityId);
            }).catch((error) => {
                this.handleErrors(error);
                return error;
            })
        }
        else {
            if (this.validate(body)) {
                $(".post-template").remove();
                this.Controller.postList(body).then((response) => {
                    return response.json();
                }).then((json) => {
                    json.posts.forEach(post => {
                        this._postDetailsPageLoader.loadPost(post, (`${parentSelector}`), false, position);
                    });
                    this.uploadPagination(json.pagination);
                }).catch((error) => {
                    this.handleErrors(error);
                    return error;
                })
            }
        }
    }

    loadElements() {
        this._makePostPageLoader.loadTags("#tag-filter");
        this.loadActions();
        this.loadPagination();
        Common.waitForElm("#post-pagination-size").then(() => {
            this.loadPosts(this.formBody(1), "#filters-form", Common.default.NewElementPosition.after);
        });
    }

    async loadPage(authorFilter = null, element = "body") {
        this.authorFilter = authorFilter;
        await super.loadPage(element)
    } 
}