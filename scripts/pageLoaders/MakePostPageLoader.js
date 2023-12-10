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

    getAddressId() {
        let $lastInput = $(".address-template:last").find(".address-input");
        if ($lastInput.val() == "none") {
            let $secondToLastInput = $(".address-template:last").prev().find(".address-input");
            if ($secondToLastInput === null || $secondToLastInput.val() === undefined) {
                return null;
            }
            return $secondToLastInput.val();
        }
        return $lastInput.val();
    }

    uploadAddresses(id, level, parentObjectId, query = null) {
        let $selectInput = $(`#${id}`);
        this.Controller.searchAddress(parentObjectId, query).then((response) => {
            return response.json();
        }).then((json) => {
            if (json.length > 0) {
                let $template = $('.basic-address-option').first().clone();
                $template.attr("id", `address-${level}-none`);
                $selectInput.empty();
                $selectInput.append($template);
                json.forEach(element => {
                    $template = $('.basic-address-option').first().clone();
                    $template.attr("id", `address-${level}-${element.objectId}`);
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

    updateOptons(selectId) {
        let $parent = $(".select2-results__options:last");
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
                $(`#${selectId}`).val($(event.target).attr("id"));
                $(`#select2-${selectId}-container`).attr("title", $(event.target).attr("id"));
                $(`#select2-${selectId}-container`).text($(`#${selectId} option[value=${$(event.target).attr("id")}]`).text());
                $(`#${selectId}`).trigger('selected-option-changed')
            });
            $parent.append($child);
            $child = $child.clone();
        });
    }

    addAddressField(previousId = null) {
        this.Controller.searchAddress(previousId, null).then((response) => {
            return response.json();
        }).then((json) => {
            if (json.length > 0) {
                let levelRussian = json[0].objectLevelText;
                let level = json[0].objectLevel;
                $.get("../../source/templates/element-templates/address-template.html", null, function (data) {
                    let $template = $(data).clone();
                    let $label = $template.find("label");
                    let $select = $template.find("select");
                    $template.attr("id", `address-${level}-template`);
                    $select.attr("id", `address-${level}-level`);
                    $select.select2();
                    $label.attr("for", `address-${level}-level`)
                    $label.attr("id", `label-address-${level}-level`);
                    $label.text(levelRussian);
                    $("#create-post-button").before($template);
                }).done(() => {
                    this.loadAddress(`address-${level}-level`, level, previousId);
                })
            }
        }).catch((error) => {
            this.handleErros(error);
            return error;
        });
    }

    loadAddress(id, level, parentObjectId = null) {
        Common.waitForElm(`#${id}`).then(async (element) => {
            let $selectInput = $(element);
            $selectInput.on('selected-option-changed', async() => {
                await $(`#address-${level}-template`).nextAll('.address-template').remove();
                if ($selectInput.val() != "none") {
                    this.addAddressField($selectInput.val());
                }
            })
            await this.uploadAddresses(id, level, parentObjectId);
            await Common.waitForElm(`#select2-${id}-container`).then(() => {
                $(`#address-${level}-template > .input-group > .select2-container`).click(async() => {
                    $(".select2-results__option:first").addClass("results-option");
                    await this.updateOptons(id);
                    Common.waitForElm('.select2-search__field').then(async() => {
                        $('.select2-search__field').unbind();
                        $('.select2-dropdown').unbind();
                        $('.select2-dropdown').on('input', async() => {
                            let query = await $('.select2-search__field').val() === "" ? " " : $('.select2-search__field').val();
                            await this.uploadAddresses(id, level, parentObjectId, query);
                            this.updateOptons(id);
                        });
                    })
                })
            })
        })
    }

    loadGroups() {
        this.Controller.communityUsers().then((response) => {
            return response.json();
        }).then((json) => {
            json.forEach(element => {
                if (element.role == Common.default.CommunityRoles.admin) {
                    this.Controller.communityInfo(element.communityId)
                        .then((response) => {
                            return response.json();
                        }).then((json) => {
                            let $template = $("#groups-basic-option").clone();
                            $template.removeAttr("selected");
                            $template.attr("id", `Group-${json.name}`);
                            $template.attr("value", `${json.name}`);
                            $template.text(json.name);
                            $template.val(json.id);
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
                let $template = $("#groups-basic-option:first").clone();
                $template.removeAttr("selected");
                $template.attr("id", `tag-${element.name}`);
                $template.attr("value", `${element.name}`);
                $template.text(element.name);
                $template.val(element.id);
                $("#new-post-tags-input").append($template);
            });
        }).catch((error) => {
            this.handleErros(error);
            return error;
        })
    }

    async createPost() {
        let body = {
            title: $('#new-post-name-input').val(),
            description: $('#new-post-content').val(),
            readingTime: $('#new-post-reading-time-input').val(),
            image: $('#new-post-image-link-input').val() == "" ? null : $('#new-post-image-link-input').val(),
            addressId: this.getAddressId(),
            tags: $('#new-post-tags-input').val()
        }
        if (this.validate(body)) {
            console.log(body);
            if ($("#new-post-group-input").val() === "none") {
                await this.Controller.postCreate(body).catch((error) => {
                    this.handleErros(error);
                    return error;
                })
            } else {
                await this.Controller.postCreate(body).catch((error) => {
                    this.handleErros(error);
                    return error;
                });
            }
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
            this.addAddressField();
        })
    }

    loadNavElements() {
        PageLoader.displayElements([".main-nav-item"]);
    }

    loadPage(element = "body") {
        super.loadPage(element);
    } 
}