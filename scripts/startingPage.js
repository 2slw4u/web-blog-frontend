import * as Common from "./common.js";
import { StartingPageLoader } from "./pageLoaders/StartingPageLoader.js";
import { LoginPageLoader } from "./pageLoaders/LoginPageLoader.js";
import { ApiController} from "./api/ApiController.js";

export default Common;

let _startingPageLoader = new StartingPageLoader();
let _loginPageLoader = new LoginPageLoader();

document.addEventListener("DOMContentLoaded", async () => {
    _startingPageLoader.loadPage();
    localStorage.setItem("token", null);
    await $("#nav-starting-page").click(() => {
        _startingPageLoader.loadPage();
    });
    await $("#nav-login-page").click(() => {
        _loginPageLoader.loadPage();
    });
})