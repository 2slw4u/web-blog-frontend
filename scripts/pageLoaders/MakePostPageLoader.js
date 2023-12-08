import { PageLoader } from "./PageLoader.js";
import * as Common from "../common.js";
import { Validator } from "../Validator.js";


export class MakePostPageLoader extends PageLoader {

    constructor() {
        super("../../source/templates/page-templates/make-post-page-template.html");
    }

    validate(body) {
        let errors = new Array();
        errors.push(Validator.validatePostTitle(body.title, "#new-post-name-input"));
        errors.push(Validator.validateReadingTime(body.readingTime, "#new-post-reading-time-input"));
        errors.push(Validator.validateImageURL(body.image, "#new-post-image-link-input"));
        errors.push(Validator.validateTags(body.tags, "#new-post-tags-input"));
        return super.validate(errors);
    }

    handleErros(err) {
        super.handleErrors(err);
    }

    getAddressSearches() {
        return null;
    }

    getAddressId() {
        return null;
    }

    async uploadAddresses(id, parentObjectId, query) {
        let $selectInput = $(`#${id}`);
        this.Controller.searchAddress(parentObjectId, query).then((response) => {
            return response.json();
        }).then((json) => {
            //console.log(json);
            if (json.length > 0) {
                $selectInput.empty();
                json.forEach(element => {
                    let $template = $("#option-basic").clone();
                    $template.attr("id", `Address-${element.objectId}`);
                    $template.attr("value", `${element.objectId}`);
                    $template.text(element.text);
                    $template.removeAttr("selected");
                    $selectInput.append($template);
                });
            }
        }).catch((error) => {
            this.handleErros(error);
            return error;
        });
    }

    async loadAddress(id, parentObjectId = null) {
        let $selectInput = $(`#${id}`);
        $selectInput.select2();
        let $labelForSelectInput = $(`#label-${id}`);

        this.Controller.searchAddress(parentObjectId, null).then((response) => {
            return response.json();
        }).then((json) => {
            //console.log(json);
            if (json.length > 0) {
                $labelForSelectInput.text(json[0].objectLevelText);
            }
        }).catch((error) => {
            this.handleErros(error);
            return error;
        });

        await Common.waitForElm(`#select2-${id}-container`).then((element) => {
            $(".select2-container").click(async () => {
                await Common.waitForElm('.select2-search__field').then((element) => {
                    $('.select2-search__field').on('input', (event) => {
                        let query = $('.select2-search__field').val() === ""? " " : $('.select2-search__field').val(); 
                        this.uploadAddresses(id, 1281271, query);
                        console.log($('.select2-search__field').val());
                    });
                })
            })
        })
        $selectInput.change(() => {
            //console.log($selectInput.val());
        })
        this.uploadAddresses(id, 1281271);
    }

    loadGroups() {
        this.Controller.communityUsers().then((response) => {
            return response.json();
        }).then((json) => {
            //console.log(json);
            json.forEach(element => {
                //console.log(element);
                if (element.role == Common.CommunityRoles.admin) {
                    //console.log(element.communityId);
                    this.Controller.communityInfo(element.communityId)
                        .then((response) => {
                            return response.json();
                        }).then((json) => {
                            let $template = $("#option-basic").clone();
                            $template.removeAttr("selected");
                            $template.attr("id", `Group-${json.name}`);
                            $template.attr("value", `${json.name}`);
                            $template.text(json.name);
                            $("#new-post-group-input").append($template);
                            return json;
                        }).catch((error) => {
                            this.handleErros(error);
                            return error;
                        })
                }
            });
        }).catch((error) => {
            this.handleErros(error);
            return error;
        })
    }

    loadTags() {
        this.Controller.tagList().then((response) => {
            return response.json();
        }).then((json) => {
            json.forEach(element => {
                let $template = $("#option-basic").clone();
                $template.removeAttr("selected");
                $template.attr("id", `tag-${element.name}`);
                $template.attr("value", `${element.name}`);
                $template.text(element.name);
                $("#new-post-tags-input").append($template);
            });
        }).catch((error) => {
            this.handleErros(error);
            return error;
        })
    }

    async createPost() {
        var body = {
            title: $('#new-post-name-input').val(),
            description: $('#new-post-content').val(),
            readingTime: $('#new-post-reading-time-input').val(),
            image: $('#new-post-image-link-input').val(),
            addressId: this.getAddressId(),
            tags: $('#new-post-tags-input').val()
        }
        console.log(body);
        if (this.validate(body)) {
            /* await this.Controller.accountEditInfo(body).catch((error) => {
                this.handleErros(error);
                return error;
            }); */
            return true;
        }
        return false;
    }

    async loadElements() {
        await Common.waitForElm("#new-post-group-input").then(() => {
            this.loadGroups();
        }).then(() => {
            Common.waitForElm("#new-post-tags-input").then(() => {
                this.loadTags();
            });
        }).then(() => {
            Common.waitForElm("#create-post-button").then((elm) => {
                $(elm).click(() => {
                    if (this.createPost()) {
                        $("nav-main-page").trigger("click");
                    }
                });
            });
        }).then(() => {
            Common.waitForElm("#address-Region-level").then(() => {
                this.loadAddress("address-Region-level");
            });
        })
    }

    loadNavElements() {
        PageLoader.displayElements([".main-nav-item"]);
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}