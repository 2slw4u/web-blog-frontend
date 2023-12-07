class ValidationResult {
    constructor(success, container, message) {
        this.success = success;
        this.container = container;
        this.message = message;
    }
}

export class Validator {

    static validateEmail(email, container) {
        if (email.match(new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}")) == null) {
            return new ValidationResult(false, container, "Doesn't look like email"); 
        }
        return new ValidationResult(true, container, "Looks suitable!"); 
    }

    static validatePassword(password, container) {
        if (password.match(new RegExp("[0-9]")) == null) {
            console.log(password, password.match(new RegExp(".*\d.*")));
            return new ValidationResult(false, container, "Password should contain a number"); 
        }
        if (password.match(new RegExp("[a-zA-Z]")) == null) {
            return new ValidationResult(false, container, "Password should contain a letter"); 
        }
        if (password.match(new RegExp("[A-Z]")) == null) {
            return new ValidationResult(false, container, "Password should contain a capital letter"); 
        }
        if (password.match(new RegExp("[^a-zA-Z0-9]")) == null) {
            return new ValidationResult(false, container, "Password should contain a special symbol"); 
        }
        if (password.length <= 6) {
            return new ValidationResult(false, container, "Password should be longer than 6 symbols"); 
        }
        return new ValidationResult(true, container, "Looks suitable!"); 
    }
}