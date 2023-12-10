import * as Common from "./common.js";
import { StartingPageLoader } from "./pageLoaders/StartingPageLoader.js";
import { LoginPageLoader } from "./pageLoaders/LoginPageLoader.js";
import { ApiController} from "./api/ApiController.js";

export default Common;

let _startingPageLoader = new StartingPageLoader();

document.addEventListener("DOMContentLoaded", async () => {
    localStorage.setItem("token", null);
    localStorage.setItem("userEmail", null);
    localStorage.setItem("userId", null);
    enableTooltips();
    _startingPageLoader.loadPage();
})

function enableTooltips() {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    })
}