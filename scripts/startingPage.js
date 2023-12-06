import * as Common from "./common.js";
import { StartingPageLoader } from "./pageLoaders/StartingPageLoader.js";

export default Common;

let _loader = new StartingPageLoader();

document.addEventListener("DOMContentLoaded", async () => {
    _loader.loadPage();
    localStorage.setItem("token", null);
    await $("#nav-main-page").click(() => {
        _loader.loadPage();
    });
})