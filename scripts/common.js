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

export function changeValidation(selector, enable, text=null) {
    if (enable == 1) {
        $(`${selector}`).removeClass('is-invalid');
        $(`${selector}`).addClass('is-valid');
        //$(`${selector}`).val(text);
        $(`${selector}`).offsetParent().find('div.valid-feedback').text(text);
    }
    else {
        $(`${selector}`).addClass('is-invalid');
        $(`${selector}`).removeClass('is-valid');
        //$(`${selector}`).val(text);
        //$(`${selector}`).siblings('.invalid-feedback').val(text)
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