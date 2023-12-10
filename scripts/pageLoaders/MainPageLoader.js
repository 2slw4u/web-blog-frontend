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
            this.loadPosts(1, "#filters-form", Common.default.NewElementPosition.after);
        });
    }

    uploadPagination(pagination) {
        $.get("../../source/templates/element-templates/post-pagination-template.html", null, function (data) {
            let $template = $(data).clone();
            $template = $template.find(".post-pagination-nav-template");
            $template.find("#pagination-basic-option > .page-link").text(pagination.current);
            if(pagination.current - 1 > 0) {
                let $pageBefore = $("#pagination-basic-option").clone();
                $pageBefore.attr("id", "pagination-before-basic-option");
                $pageBefore.find(".page-link").text(pagination.current - 1);
                console.log($pageBefore);
                $template.find("#pagination-basic-option").before($pageBefore);
            }
            if (pagination.current + 1 <= pagination.size) {
                let $pageAfter = $("#pagination-basic-option").clone();
                $pageAfter.attr("id", "pagination-after-basic-option");
                $pageAfter.find(".page-link").text(pagination.current + 1);
                console.log($pageAfter);
                $template.find("#pagination-basic-option").after($pageAfter);
            }
            $(".post-pagination-nav-template").replaceWith($template);
        }).then(() => {
            if (pagination.current - 1 > 0) {
                let $pageBefore = $("#pagination-before-basic-option");
                $pageBefore.click(() => {
                    this.loadPosts(Number($pageBefore.find(".page-link").text()), "#filters-form", Common.default.NewElementPosition.after);
                });
                $("#pagination-previous-item").click(() => {
                    this.loadPosts(pagination.current - 1, "#filters-form", Common.default.NewElementPosition.after);
                });
            }
            if (pagination.current + 1 <= pagination.size) {
                let $pageAfter = $("#pagination-after-basic-option");
                $pageAfter.click(() => {
                    this.loadPosts(Number($pageAfter.find(".page-link").text()), "#filters-form", Common.default.NewElementPosition.after);
                });
                $("#pagination-next-item").click(() => {
                    this.loadPosts(pagination.current + 1, "#filters-form", Common.default.NewElementPosition.after);
                });
            }
        });
    }

    loadPagination() {
        $.get("../../source/templates/element-templates/post-pagination-template.html", null, function (data) {
            let $template = $(data).clone();
            $("#pageContent").append($template);
        }).then(() => {
            $("#post-pagination-size").change(() => {
                this.loadPosts(1, "#filters-form", Common.default.NewElementPosition.after);
            })
        });
    }

    loadPosts(page, parentSelector, position) {
        let body = {
            tag: $("#tag-filter").val().length == 0 ? null : $("#tag-filter").val(),
            author: $("#author-filter").val() == "" ? null : $("#author-filter").val(),
            min: $("#reading-time-min").val() == "" ? null : $("#reading-time-min").val(),
            max: $("#reading-time-max").val() == "" ? null : $("#reading-time-max").val(),
            sorting: $("#sort-filter").val(),
            onlyMyCommunities: $("#only-users-groups").attr("checked") == 0 ? false : true,
            page: page,
            size: $("#post-pagination-size").val()
        };
        if (this.validate(body)) {
            $(".post-template").remove();
            this.Controller.postList(body).then((response) => {
                return response.json();
            }).then((json) => {
                console.log(json);
                json.posts.forEach(post => {
                    this._postDetailsPageLoader.loadPost(post, (`${parentSelector}`), false, position);
                });
                this.uploadPagination(json.pagination);
            }).catch((error) => {
                this.handleErrors(error);
                return error;
            })
            //console.log(body);
        }
    }

    loadElements() {
        this._makePostPageLoader.loadTags("#tag-filter");
        this.loadActions();
        this.loadPagination();
        Common.waitForElm("#post-pagination-size").then(() => {
            this.loadPosts(1, "#filters-form", Common.default.NewElementPosition.after);
        });
    }

    async loadPage(element = "body") {
        super.loadPage(element);
    } 
}