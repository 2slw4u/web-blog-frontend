const Methods = {
    get: "GET",
    put: "PUT",
    post: "POST",
    delete: "DELETE"
}

export class ApiController {
    constructor() {
        this.url_common = "https://blog.kreosoft.space/api/";
    }

    async formFetchAdditive(array) {
        if (array.length == 0) {
            return "";
        }
        let result = array.length < 1 ? "" : `?${array[0].name}=${array[0].value}`;
        for (let i = 1; i < array.length; i++) {
            const element = array[i];
            result += `&${element.name}=${element.value}`;
        }
        return result;
    }

    async executeMethod(method, url_specified, body = null) {
        let response = await fetch(`${this.url_common}${url_specified}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "accept": "application/json"
            },
            body: body == null ? null : JSON.stringify(body)
        })
        if (!response.ok) {
            console.log(response);
            throw new Error("Something went wrong");
        }
        return response;

    }

    async searchAddress(parentObjectId, query) {
        let array = [];
        if (parentObjectId != null) {
            array.push({
                name: "parentObjectId",
                value: parentObjectId
            })
        }
        if (query != null) {
            array.push({
                name: "query",
                value: query
            })
        }
        let fetchAdditive = "";
        if (array.length != 0) {
            fetchAdditive = await this.formFetchAdditive(array);
        }
        return this.executeMethod(Methods.get, `address/search${fetchAdditive}`)
    }

    async chainAddress(objectGuid) {
        let array = [];
        if (objectGuid != null) {
            array.push({
                name: "objectGuid",
                value: objectGuid
            })
        }
        let fetchAdditive = "";
        fetchAdditive = await this.formFetchAdditive(array);
        return this.executeMethod(Methods.get, `address/chain${fetchAdditive}`)
    }

    async authorList(body) {
        return this.executeMethod(Methods.get, "author/list", body)
    }

    async commentTree(commentId) {
        return this.executeMethod(Methods.get, `comment/${commentId}/tree`)
    }

    async commentPost(postId, body) {
        return this.executeMethod(Methods.post, `post/${postId}/comment`, body)
    }

    async commentEdit(commentId, body) {
        return this.executeMethod(Methods.put, `comment/${commentId}`, body)
    }

    async commentDelete(commentId) {
        return this.executeMethod(Methods.delete, `comment/${commentId}`)
    }

    async communityList() {
        return this.executeMethod(Methods.get, `community`)
    }

    async communityUsers() {
        return this.executeMethod(Methods.get, `community/my`)
    }

    async communityInfo(communityId) {
        return this.executeMethod(Methods.get, `community/${communityId}`)
    }

    async communityPosts(communityId, body) {
        let array = [];
        if (body.tag != null) {
            body.tag.forEach(element => {
                array.push({
                    name: "tag",
                    value: element
                });
            });
        }
        array.push({
            name: "sorting",
            value: body.sorting
        })
        array.push({
            name: "page",
            value: body.page
        })
        array.push({
            name: "size",
            value: body.size
        })
        let fetchAdditive = "";
        fetchAdditive = await this.formFetchAdditive(array);
        console.log(`post${fetchAdditive}`);
        return this.executeMethod(Methods.get, `community/${communityId}/post${fetchAdditive}`)
    }

    async communityPostCreate(communityId, body) {
        return this.executeMethod(Methods.post, `community/${communityId}/post`, body)
    }

    async communityUsersRole(communityId) {
        return this.executeMethod(Methods.get, `community/${communityId}/role`)
    }

    async communitySubscribe(communityId) {
        return this.executeMethod(Methods.post, `community/${communityId}/subscribe`)
    }

    async communityUnsubscribe(communityId) {
        return this.executeMethod(Methods.delete, `community/${communityId}/unsubscribe`)
    }

    async postList(body) {
        let array = [];
        if (body.tag != null) {
            body.tag.forEach(element => {
                array.push({
                    name: "tag",
                    value: element
                });
            });
        }
        if (body.author != null) {
            array.push({
                name: "author",
                value: body.author
            })
        }
        if (body.min != null) {
            array.push({
                name: "min",
                value: body.min
            })
        }
        if (body.max != null) {
            array.push({
                name: "max",
                value: body.max
            })
        }
        array.push({
            name: "sorting",
            value: body.sorting
        })
        array.push({
            name: "onlyMyCommunities",
            value: body.onlyMyCommunities
        })
        array.push({
            name: "page",
            value: body.page
        })
        array.push({
            name: "size",
            value: body.size
        })
        let fetchAdditive = "";
        fetchAdditive = await this.formFetchAdditive(array);
        return this.executeMethod(Methods.get, `post${fetchAdditive}`);
    }

    async postCreate(body) {
        return this.executeMethod(Methods.post, `post`, body)
    }

    async postInfo(postId) {
        return this.executeMethod(Methods.get, `post/${postId}`)
    }

    async postLike(postId) {
        return this.executeMethod(Methods.post, `post/${postId}/like`)
    }

    async postRemoveLike(postId) {
        return this.executeMethod(Methods.delete, `post/${postId}/like`)
    }

    async tagList() {
        return this.executeMethod(Methods.get, `tag`)
    }

    async accountRegister(body) {
        return this.executeMethod(Methods.post, `account/register`, body)
    }

    async accountLogin(body) {
        return this.executeMethod(Methods.post, `account/login`, body)
    }

    async accountLogout() {
        return this.executeMethod(Methods.post, `account/logout`)
    }

    async accountInfo() {
        return this.executeMethod(Methods.get, `account/profile`)
    }

    async accountEditInfo(body) {
        return this.executeMethod(Methods.put, `account/profile`, body)
    }
}