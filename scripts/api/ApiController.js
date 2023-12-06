const Methods = {
    get: "GET",
    put: "PUT",
    post: "POST",
    delete: "DELETE"
}

export class ApiController {
    url_common = "https://blog.kreosoft.space/api/";

    async executeMethod(method, url_specified, body = null) {
        let responseData = {}
        const response = await fetch(`${url_common}${url_specified}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: body == null ? null : JSON.stringify(body)
        }).then((json) => {
            responseData.body = json;
        }).catch((error) => {
            responseData.error = response.statusText;
            console.log(error);
        })
    }
    
    async searchAddress(body) {
        return executeMethod(Methods.get, "address/search", body)
    }

    async chainAddress(body) {
        return executeMethod(Methods.get, "address/chain", body)
    }

    async authorList(body) {
        return executeMethod(Methods.get, "author/list", body)
    }

    async commentTree(commentId) {
        return executeMethod(Methods.get, `comment/${commentId}/tree`)
    }
    
    async commentPost(postId, body) {
        return executeMethod(Methods.post, `post/${postId}/tree`, body)
    }

    async commentEdit(commentId, body) {
        return executeMethod(Methods.put, `comment/${commentId}`, body)
    }

    async commentDelete(commentId) {
        return executeMethod(Methods.delete, `comment/${commentId}`)
    }

    async communityList() {
        return executeMethod(Methods.get, `community`)
    }

    async communityUsers() {
        return executeMethod(Methods.get, `community/my`)
    }

    async communityInfo(communityId) {
        return executeMethod(Methods.get, `community/${communityId}`)
    }

    async communityPosts(communityId, body) {
        return executeMethod(Methods.get, `community/${communityId}/post`, body)
    }

    async communityPostCreate(communityId, body) {
        return executeMethod(Methods.post, `community/${communityId}/post`, body)
    }

    async communityUsersRole(communityId) {
        return executeMethod(Methods.get, `community/${communityId}/role`)
    }

    async communitySubscribe(communityId) {
        return executeMethod(Methods.post, `community/${communityId}/subscribe`)
    }

    async communityUnsubscribe(communityId) {
        return executeMethod(Methods.delete, `community/${communityId}/unsubscribe`)
    }

    async postList(body) {
        return executeMethod(Methods.get, `post`, body)
    }

    async postCreate(body) {
        return executeMethod(Methods.post, `post`, body)
    }

    async postInfo(postId) {
        return executeMethod(Methods.get, `post/${postId}`)
    }

    async postLike(postId) {
        return executeMethod(Methods.post, `post/${postId}/like`)
    }

    async postRemoveLike(postId) {
        return executeMethod(Methods.delete, `post/${postId}/like`)
    }

    async tagList() {
        return executeMethod(Methods.get, `tag`)
    }

    async accountRegister(body) {
        return executeMethod(Methods.post, `account/register`, body)
    }

    async accountLogin(body) {
        return executeMethod(Methods.post, `account/login`, body)
    }

    async accountLogout() {
        return executeMethod(Methods.post, `account/logout`)
    }

    async accountInfo() {
        return executeMethod(Methods.get, `account/profile`)
    }

    async accountEditInfo(body) {
        return executeMethod(Methods.put, `account/profile`, body)
    }

}