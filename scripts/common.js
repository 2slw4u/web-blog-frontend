import * as Constants from '../source/constants/constants.js';

export default Constants; 

export function changeValidation(selector, enable, text=null) {
    if (enable == 1) {
        $(`${selector}`).removeClass('is-invalid');
        $(`${selector}`).addClass('is-valid');
        $(`${selector}`).offsetParent().find('div.valid-feedback').text(text);
    }
    else {
        $(`${selector}`).addClass('is-invalid');
        $(`${selector}`).removeClass('is-valid');
        $(`${selector}`).offsetParent().find('div.invalid-feedback').text(text);
    }
}

export function changeDisplayOfElements(selector, enable) {
    if (enable == 1) {
        $(`${selector}`).removeClass('d-none');
    }
    else {
        $(`${selector}`).addClass('d-none');
    }
}

function defineUsersAuthorization() {
    if (localStorage.getItem("token") != "null") {
        return true;
    }
    return false;
}

export function changeAuthorizedDisplay() {
    if (defineUsersAuthorization()) {
        changeDisplayOfElements(Constants.CommonElementClasses.authorizedElement, Constants.Enabling.enable);
        changeDisplayOfElements(Constants.CommonElementClasses.unauthorizedElement, Constants.Enabling.disable);
        $("#nav-user-menu").text(localStorage.getItem("userEmail"));
    }
    else {
        changeDisplayOfElements(Constants.CommonElementClasses.authorizedElement, Constants.Enabling.disable);
        changeDisplayOfElements(Constants.CommonElementClasses.unauthorizedElement, Constants.Enabling.enable);
    }
}

export function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function formatDateComponent(component, goal) {
    if (component == 0) {
        component = 1;
    } 
    if (component < goal) {
        let result = component.toString();
        while (component < goal) {
            result = "0" + result;
            component*=10;
        }
        return result;
    }
    return component.toString();
}


export function formatDate(date, full=false) {
    let unformattedDate = new Date(date);
    if (full) {
        return `${formatDateComponent(unformattedDate.getFullYear(), 1000)}-${formatDateComponent(unformattedDate.getMonth() + 1, 10)}-${formatDateComponent(unformattedDate.getDate(), 10)} ${formatDateComponent(unformattedDate.getHours(), 10)}:${formatDateComponent(unformattedDate.getMinutes(), 10)}`
    }
    return `${formatDateComponent(unformattedDate.getFullYear(), 1000)}-${formatDateComponent(unformattedDate.getMonth() + 1, 10)}-${formatDateComponent(unformattedDate.getDate(), 10)}`
}