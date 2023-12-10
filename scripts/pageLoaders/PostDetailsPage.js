import { PageLoader } from "./PageLoader.js";
import { Validator } from "../Validator.js";
import * as Common from "../common.js";

export class PostDetailsPageLoader extends PageLoader {

    thisPostId;

    constructor() {
        super("../../source/templates/page-templates/post-details-page-template.html");
    }

    validate(content, container) {
        let errors = new Array();
        errors.push(Validator.validateContent(content, container));
        return super.validate(errors);
    }

    loadNavElements() {
        PageLoader.displayElements([".main-nav-item"]);
    }

    handleErros(err) {
        super.handleErrors(err);
    }
    
    loadResponses(parentCommentId) {
        this.Controller.commentTree(parentCommentId).then((response) => {
            return response.json();
        }).then((json) => {
            this.loadComments(json, `Comment-${parentCommentId} > .responses-section`, "../../source/templates/element-templates/response-template.html");
        }).catch((error) => {
            this.handleErros(error);
            return error;
        })
    }

    loadShowRespondingAction(commentId) {
        let comment = `#Comment-${commentId}`
        $(`${comment} > .action-initialize-response`).click(() => {
            if ($(`${comment} > .comment-create-response-section`).hasClass("d-none")) {
                $(`${comment} > .comment-create-response-section`).removeClass("d-none");
            }
            else {
                $(`${comment} > .comment-create-response-section`).addClass("d-none");
                Common.changeValidation(`#Comment-${commentId} > .comment-create-response-section > .comment-create-response-input`, 1);
                $(`#Comment-${commentId} > .comment-create-response-section > .comment-create-response-input`).removeClass("border-danger");
            }
        });
    }

    loadSendResponseAction(commentId) {
        let $comment = $(`#Comment-${commentId} > .comment-create-response-section`);
        $comment.find(".action-send-response").click(() => {
            let body = {
                content: $comment.find(".comment-create-response-input").val(),
                parentId: commentId
            };
            if (this.validate(body.content, `#Comment-${commentId} > .comment-create-response-section > .comment-create-response-input`)) {
                this.Controller.commentPost(this.thisPostId, body).then(() => {
                    this.loadPage(this.thisPostId, "#comment-section");
                }).catch(() => {
                    this.handleErrors(error);
                    return error;
                });
            }
            else {
                $(`#Comment-${commentId} > .comment-create-response-section > .comment-create-response-input`).addClass("border-danger");
            }
        })
    }

    loadDeleteAction(commentId) {
        $(`#Comment-${commentId} > .comment-user-actions > .action-delete`).click(() => {
            this.Controller.commentDelete(commentId).catch((error) => {
                this.handleErrors(error);
                return error;
            });
            this.loadPage(this.thisPostId, "#comment-section");
        });
    }

    loadShowEditAction(commentId) {
        let comment = `#Comment-${commentId}`;
        $(`${comment} > .comment-user-actions`).find(".action-edit").click(() => {
            if ($(`${comment} > .comment-content-wrapper`).find(".comment-edit-section").hasClass("d-none")) {
                $(`${comment} > .comment-content-wrapper`).find(".comment-edit-section").removeClass("d-none");
            }
            else {
                $(`${comment} > .comment-content-wrapper`).find(".comment-edit-section").addClass("d-none");
                Common.changeValidation(`#Comment-${commentId} > .comment-content-wrapper > .comment-edit-section > .comment-edit-content-input`, 1)
                $(`#Comment-${commentId} > .comment-content-wrapper > .comment-edit-section > .comment-edit-content-input`).removeClass("border-danger");
            }
        })
    }

    loadEditAction(commentId) {
        let $comment = $(`#Comment-${commentId} > .comment-content-wrapper > .comment-edit-section`);
        $comment.find(".submit-edit-comment").click(() => {
            let body = {
                content: $comment.find(".comment-edit-content-input").val()
            };
            if (this.validate(body.content, `#Comment-${commentId} > .comment-content-wrapper > .comment-edit-section > .comment-edit-content-input`)) {
                this.Controller.commentEdit(commentId, body).catch(() => {
                    this.handleErrors(error);
                    return error;
                });
                console.log(commentId + " comment has been modified");
                this.loadPage(this.thisPostId, "#comment-section");
            }
            else {
                $(`#Comment-${commentId} > .comment-content-wrapper > .comment-edit-section > .comment-edit-content-input`).addClass("border-danger");
            }
        })
    }

    loadShowResponsesAction(commentId) {
        let comment = `#Comment-${commentId}`;
        $(`${comment} > .responses-section`).find(".action-show-responses").click(async(event)=> {
            if ($(event.target).hasClass("responses-shown")) {
                $(event.target).removeClass("responses-shown");
                $(event.target).text("Раскрыть ответы");
                $(`${comment} > .responses-section > .response-template`).remove();
            } 
            else {
                //$(event.target).addClass("d-none");
                $(event.target).addClass("responses-shown");
                $(event.target).text("Скрыть ответы");
                this.loadResponses(commentId);
            }
        })
    }

    async loadCommentActions(commentId, authorId) {
        let $comment = $(`#Comment-${commentId}`);
        $comment.find(".comment-user-actions").addClass("d-none");
        if (localStorage.getItem("token") == "null") {
            $comment.find(".action-initialize-response").addClass("d-none");
        }
        if (authorId == localStorage.getItem("userId") && $comment.find(".comment-user-name").text() != Common.Deleted) {
            $comment.find(".comment-user-actions").removeClass("d-none");
        }
        
        this.loadShowRespondingAction(commentId);
        this.loadSendResponseAction(commentId);
        this.loadDeleteAction(commentId);
        this.loadShowEditAction(commentId);
        this.loadEditAction(commentId);
        this.loadShowResponsesAction(commentId);
    }

    loadComments(comments, parentId, template) {
        let $parent = $(`#${parentId}`)
        comments.forEach(comment => {
            $.get(template, null, function(data) {
                let $template = $(data).clone();
                $template.attr("id", `Comment-${comment.id}`);
                if (comment.deleteDate == null) {
                    $template.find(".comment-user-name").text(comment.author);
                    $template.find(".comment-content").text(comment.content);
                    if (comment.modifiedDate != null) {
                        $template.find(".comment-edited-flag").attr("title", Common.formatDate(comment.modifiedDate, true));
                    } 
                    else {
                        $template.find(".comment-edited-flag").addClass("d-none");
                    }
                }
                else {
                    $template.find(".comment-user-name").text(Common.Deleted);
                    $template.find(".comment-content").text(Common.Deleted);
                    $template.find(".comment-edited-flag").addClass("d-none");
                }
                $template.find(".comment-edit-section").addClass("d-none");
                $template.find(".comment-create-response-section").addClass("d-none");
                if (comment.subComments == 0) {
                    $template.find(".action-show-responses").addClass("d-none");
                }
                $template.find(".comment-create-date").text(Common.formatDate(comment.createTime, true));
                $parent.append($template);
            }).then(() => {
                this.loadCommentActions(comment.id, comment.authorId);
            })
        });
    }

    loadPostContent(postId, content, allowExpanded = false) {
        let $post = $(`#Post-${postId}`);
        if (!allowExpanded && content.length > Common.MaxPostLength) {
            let saveContent = content;
            content = content.slice(0, Common.MaxPostLength - 1);
            $post.find("#expand-content").click((event) => {
                $post.find("#post-content").text(saveContent);
                $(event.target).addClass("d-none");
            });
        }
        else {
            $post.find("#expand-content").addClass("d-none");
        }
        $post.find("#post-content").text(content);
    }

    loadTags(postId, tags) {
        tags.forEach(element => {
            $.get("../../source/templates/element-templates/post-tag-template.html", null, function(data) {
                let $template = $(data).clone();
                $template.find("#tag-name").text(element.name);
                $(`#Post-${postId}`).find("#tags-section").append($template);
            });
        });
    }

    loadAddress(postId, addressId) {
        let $post = $(`#Post-${postId}`);
        if (addressId == null) {
            $post.find("#geo-tag-section").addClass("d-none");
        }
        else {
            this.Controller.chainAddress(addressId).then((response) => {
                return response.json();
            }).then((json) => {
                let result = "";
                json.forEach(element => {
                    result += `${element.text}, `;
                });
                result = result.slice(0, -2);
                $post.find("#geo-tag-content").text(result);
            });
        }
    } 

    loadPostActions(postId) {
        let $post = $(`#Post-${postId}`);
        $post.find($("#post-comment-section")).click(() => {
            if (this.pathName !== "../../source/templates/page-templates/post-details-page-template.html") {
                this.loadPage(postId, "#comment-section", 3000)
            }
        })
        $post.find("#post-name").click(() => {
            if (this.pathName !== "../../source/templates/page-templates/post-details-page-template.html") {
                this.loadPage(postId);
            }
        })
        $post.find($("#post-likes-section")).click(() => {
            if (localStorage.getItem("token") != "null") {
                let $target = $("#post-likes-section");
                if ($target.hasClass("liked")) {
                    $("#post-like-icon").attr("src", "../../source/images/hollow-heart-icon.svg");
                    $("#post-likes-amount").text(Number($("#post-likes-amount").text()) - 1);
                    $target.removeClass("liked");
                    this.Controller.postRemoveLike(postId).catch((error) => {
                        this.handleErros(error);
                        return error;
                    });
                }
                else {
                    $("#post-like-icon").attr("src", "../../source/images/heart-icon.svg");
                    $("#post-likes-amount").text(Number($("#post-likes-amount").text()) + 1);
                    $target.addClass("liked");
                    this.Controller.postLike(postId).catch((error) => {
                        this.handleErros(error);
                        return error;
                    });
                }
            }
        })
    }

    loadPost(json, position = Common.NewElementPosition.end) {
        $.get("../../source/templates/element-templates/post-template.html", null, function(data) {
            let $template = $(data).clone();
            $template.attr("id", `Post-${json.id}`)
            $template.find("#post-author-name").text(json.author);
            $template.find("#post-date").text(Common.formatDate(json.createTime, true));
            if (json.communityId != null) {
                $template.find("#post-group-location").text(`в сообществе ${json.communityName}`);
            } 
            $template.find("#post-name").text(json.title);
            if (json.image != null) {
                $template.find("#post-image").attr("src", json.image);
            }
            else {
                $template.find("#post-image").addClass("d-none");
            }
            $template.find("#post-reading-time").text(json.readingTime);
            $template.find("#post-comment-amount").text(json.commentsCount);
            $template.find("#post-likes-amount").text(json.likes);
            $template.find("#post-like-icon").attr("src", json.hasLike ? "../../source/images/heart-icon.svg" : "../../source/images/hollow-heart-icon.svg");
            if (json.hasLike) {
                $template.find("#post-likes-section").addClass("liked");
            }
            if (position == Common.NewElementPosition.start) {
                $("#pageContent").prepend($template);
            }
            else {
                $("#pageContent").append($template);
            }
        }).then(() => {
            this.loadPostContent(json.id, json.description, true);
            this.loadTags(json.id, json.tags);
            this.loadAddress(json.id, json.addressId);
            this.loadPostActions(json.id);
        });
    }

    loadCreateCommentSection() {
        $("#create-new-comment").click(() => {
            let body = {
                content: $("#new-comment-content").val(),
                parentId: null
            };
            if (this.validate(body.content, "#new-comment-content")) {
                $("#new-comment-content").removeClass("border-danger");
                this.Controller.commentPost(this.thisPostId, body).then(() => {
                    this.loadPage(this.thisPostId, ("#comment-section"));
                }).catch((error) => {
                    this.handleErros(error);
                    return error;
                });
            }
            else {
                $("#new-comment-content").addClass("border-danger");
            }
        })
    }

    async loadElements() {
        this.Controller.postInfo(this.thisPostId).then((response) => {
            return response.json();
        }).then((json) => {
            if (json.commentsCount != 0) {
                this.loadComments(json.comments, "comment-section", "../../source/templates/element-templates/comment-template.html");
                delete json.comments;
            }
            this.loadPost(json, Common.NewElementPosition.start);
        }).then(() => {
            this.loadCreateCommentSection();
        }).catch((error) => {
            this.handleErros(error);
            return error;
        })
    }

    loadPage(postId, element = "body") {
        this.thisPostId = postId;
        super.loadPage(element);
    } 
}