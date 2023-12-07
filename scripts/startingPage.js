import * as Common from "./common.js";
import { StartingPageLoader } from "./pageLoaders/StartingPageLoader.js";
import { LoginPageLoader } from "./pageLoaders/LoginPageLoader.js";
import { ApiController} from "./api/ApiController.js";

export default Common;

let _startingPageLoader = new StartingPageLoader();

document.addEventListener("DOMContentLoaded", async () => {
    localStorage.setItem("token", null);
    _startingPageLoader.loadPage();
})