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
            throw new Error("Login failed");
        }
        return response;
        
    }
    
    async searchAddress(body) {
        return this.executeMethod(Methods.get, "address/search", body)
    }

    async chainAddress(body) {
        return this.executeMethod(Methods.get, "address/chain", body)
    }

    async authorList(body) {
        return this.executeMethod(Methods.get, "author/list", body)
    }

    async commentTree(commentId) {
        return this.executeMethod(Methods.get, `comment/${commentId}/tree`)
    }
    
    async commentPost(postId, body) {
        return this.executeMethod(Methods.post, `post/${postId}/tree`, body)
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
        return this.executeMethod(Methods.get, `community/${communityId}/post`, body)
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
        return this.executeMethod(Methods.get, `post`, body)
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