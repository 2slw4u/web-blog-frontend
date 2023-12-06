const Enabling = {
    enable: "1",
    disable: "2"
}

function changeDisplayOfElements(selector, enable) {
    if (enable == 1) {
        $(`${selector}`).removeClass('d-none');
    }
    else {
        $(`${selector}`).addClass('d-none');
    }
}

function defineUsersAuthorization() {
    if (localStorage.getItem("token") == null) {
        changeDisplayOfElements(".authorized", Enabling.disable);
    }
}