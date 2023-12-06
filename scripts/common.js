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

export function changeDisplayOfElements(selector, enable) {
    if (enable == 1) {
        $(`${selector}`).removeClass('d-none');
    }
    else {
        $(`${selector}`).addClass('d-none');
    }
}

function defineUsersAuthorization() {
    if (true) {
        return false;
    }
    return true;
}

export function changeAuthorizedDisplay() {
    if (defineUsersAuthorization()) {
        changeDisplayOfElements(CommonElementClasses.authorizedElement, Enabling.enable);
        changeDisplayOfElements(CommonElementClasses.unauthorizedElement, Enabling.disable);
    }
    else {
        changeDisplayOfElements(CommonElementClasses.authorizedElement, Enabling.disable);
        changeDisplayOfElements(CommonElementClasses.unauthorizedElement, Enabling.enable);
    }
}