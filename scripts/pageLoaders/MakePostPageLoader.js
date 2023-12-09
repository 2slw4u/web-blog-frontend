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

    uploadAddresses(id, parentObjectId, query) {
        let $selectInput = $(`#${id}`);
        this.Controller.searchAddress(parentObjectId, query).then((response) => {
            return response.json();
        }).then((json) => {
            if (json.length > 0) {
                let $template = $("#Address-none").clone();
                $selectInput.empty();
                $selectInput.append($template);
                json.forEach(element => {
                    $template = $("#Address-none").clone();
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

    updateOpitons(selectId) {
        let $parent = $(".select2-results__options");
        let $child = $(".results-option:first").clone();
        $parent.unbind();
        $child.unbind();
        $parent.empty();
        $(`#${selectId} > option`).each((i, obj) => {
            $child.attr("id", `${obj.value}`);
            $child.attr("aria-selected", "false");
            $child.text(obj.text);
            $child.removeClass("select2-results__option");
            $child.addClass("results-option");
            $child.css("padding", "6px");
            $child.click((event) => {
                //$(`#${selectId}`).val(`${$(event.target).attr("id")}`);
                //console.log($(`#${selectId}`).find(":selected"))
                //$(`#${selectId}`).find(":selected").removeAttr("selected");
                //console.log($(`#${selectId} option`));
                //$(`#${selectId} option`).attr('selected', false);
                //console.log($(`#${selectId} option[value=${$(event.target).attr("id")}]`));
                //$(`#${selectId} option[value=${$(event.target).attr("id")}]`).attr('selected', true);
                //console.log($(`#${selectId}`).find(`#Address-${$(event.target).attr("id")}`));
                //$(`#${selectId}`).find(`#Address-${$(event.target).attr("id")}`).attr("selected", "true");
                //document.getElementById(selectId).value = $(event.target).attr("id");
                $(`#${selectId}`).val($(event.target).attr("id"));
                $(`#select2-${selectId}-container`).attr("title", $(event.target).attr("id"));
                $(`#select2-${selectId}-container`).text($(`#${selectId} option[value=${$(event.target).attr("id")}]`).text());
                $(`#${selectId}`).trigger('selected-option-changed')
                //console.log($(`#${selectId}`).text($(event.target).attr("id")));
                //$("div > span.select2-container").removeClass("select2-container--open");
                //$("body > span.select2-container").remove();
            });
            $parent.append($child);
            $child = $child.clone();
        });
    }

    addAddressField() {
        
    }

    async loadAddress(id, parentObjectId = null) {
        let $selectInput = $(`#${id}`);
        $selectInput.select2();
        let $labelForSelectInput = $(`#label-${id}`);
        this.Controller.searchAddress(parentObjectId, null).then((response) => {
            return response.json();
        }).then((json) => {
            if (json.length > 0) {
                $labelForSelectInput.text(json[0].objectLevelText);
            }
        }).catch((error) => {
            this.handleErros(error);
            return error;
        });

        $selectInput.on('selected-option-changed', () => {
            if ($selectInput.val() == "none") {
                console.log("chillin")
                //remove all elements after this one
            }
            else {
                console.log("workin")
                //add another element, unless we're on the building already
            }
        })

        await Common.waitForElm(`#select2-${id}-container`).then((element) => {
            $(".select2-container").click(async () => {
                $(".select2-results__option:first").addClass("results-option");
                await this.updateOpitons(id);
                await Common.waitForElm('.select2-search__field').then((element) => {
                    $('.select2-search__field').unbind();
                    $('.select2-dropdown').unbind();
                    $('.select2-dropdown').on('input', async() => {
                        let query = $('.select2-search__field').val() === ""? " " : $('.select2-search__field').val(); 
                        await this.uploadAddresses(id, 1281271, query);
                        await this.updateOpitons(id);
                    });
                })
            })
        })
        await this.uploadAddresses(id, 1281271);
    }

    loadGroups() {
        this.Controller.communityUsers().then((response) => {
            return response.json();
        }).then((json) => {
            json.forEach(element => {
                if (element.role == Common.CommunityRoles.admin) {
                    this.Controller.communityInfo(element.communityId)
                        .then((response) => {
                            return response.json();
                        }).then((json) => {
                            let $template = $("#groups-basic-option").clone();
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
                let $template = $("#groups-basic-option").clone();
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
            /* create post 
            await this.Controller.createPost(body).catch((error) => {
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