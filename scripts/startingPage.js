import {defineUsersAuthorization} from "./common.js"

function loadStartingPage() {
    defineUsersAuthorization();
    $("#pageContent").empty();
} 

