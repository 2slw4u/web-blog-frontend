import Common from "../startingPage.js";
import { MainPageLoader } from "./MainPageLoader.js";
import { PageLoader } from "./PageLoader.js";

export class AuthorsPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/authors-page-template.html");
    }

    loadNavElements() {
        PageLoader.displayElements([".authors-nav-item"]);
    }

    handleErrors() {
        super.handleErrors();
    }

    setUpCrowns() {
        this.Controller.authorList().then((response) => {
            return response.json();
        }).then((json) => {
            json.sort((a,b) => ((a.posts + a.likes) > (b.posts + b.likes)) ? -1 : 1);
            let authors = [];
            Common.waitForElm(`#${json[0].fullName}`).then(() => {
                for (let i = 0; i < json.length && i < 3; ++i) {
                    authors.push($(`#${json[i].fullName}`));
                }
                authors.forEach((element, index) => {
                    element.find("#ratingIcon").removeClass("d-none");
                    if (index === 0) {
                        element.find("#ratingIcon").attr("src", "../../source/images/crown-solid-icon-golden.svg");
                    }
                    else if (index === 1) {
                        element.find("#ratingIcon").attr("src", "../../source/images/crown-solid-icon-silver.svg");
                    }
                    else {
                        element.find("#ratingIcon").attr("src", "../../source/images/crown-solid-icon-bronze.svg");
                    }
                });
            });
        })
    }

    loadElements() {
        this.Controller.authorList().then((response) => {
            return response.json();
        }).then((json) => {
            json.forEach((element) => {
                $.get("../../source/templates/element-templates/author-template.html", null, function(data){
                    let $template = $(data).clone();
                    $template.attr("id", `${element.fullName}`);
                    let authorIconSource = element.gender === 'Male'? "../../source/images/male-avatar-icon.svg" : "../../source/images/female-avatar-icon.svg";
                    $template.find("#author-icon").attr("src", authorIconSource);
                    $template.find("#author-nickname").text(element.fullName);
                    $template.find("#author-acc-create-date").text(`Создан: ${Common.formatDate(element.created)}`);
                    $template.find("#author-posts-amount").text(element.posts);
                    $template.find("#author-likes-amount").text(element.likes);
                    $template.find("#author-DOB").text(Common.formatDate(element.birthDate));
                    $template.find("#ratingIcon").addClass("d-none");
                    $template.click((event) => {
                        let _mainPageLoader = new MainPageLoader();
                        //console.log(element.fullName);
                        _mainPageLoader.loadPage(element.fullName);
                    });
                    $("#pageContent").append($template);
                })
            });
            return json;
        }).catch((error) => {
            this.handleErrors(error);
            return error;
        }).finally(() => {
            this.setUpCrowns();
        })
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}
