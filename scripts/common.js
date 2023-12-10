export const Enabling = {
    enable: 1,
    disable: 0
}

export const CommonElementClasses = {
    authorizedElement: ".authorized",
    unauthorizedElement: ".unauthorized",
    mainNavElement: ".main-nav-item",
    profileNavElement: ".profile-nav-item",
    authorsNavElement: ".authors-nav-item"
}

export const CommunityRoles = {
    nobody: "null",
    subscriber: "Subscriber",
    admin: "Administrator"
}

export const NewElementPosition = {
    start: "start",
    end: "end"
}

export const MaxPostLength = 200;

export const Deleted = "[УДАЛЕНО]";

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
        changeDisplayOfElements(CommonElementClasses.authorizedElement, Enabling.enable);
        changeDisplayOfElements(CommonElementClasses.unauthorizedElement, Enabling.disable);
        $("#nav-user-menu").text(localStorage.getItem("userEmail"));
    }
    else {
        changeDisplayOfElements(CommonElementClasses.authorizedElement, Enabling.disable);
        changeDisplayOfElements(CommonElementClasses.unauthorizedElement, Enabling.enable);
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