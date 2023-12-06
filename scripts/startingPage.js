import * as Common from "./common.js";
import { StartingPageLoader } from "./pageLoaders/StartingPageLoader.js";

export default Common;

let _loader = new StartingPageLoader();

document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem("token", null);
    _loader.loadPage();
    $("#nav-main-page").click(() => {
        _loader.loadPage();
    });

})