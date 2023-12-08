class ValidationResult {
    constructor(success, container, message) {
        this.success = success;
        this.container = container;
        this.message = message;
    }
}

const MILLISECONDS_IN_A_YEAR = 31556952000;

export class Validator {

    static validateEmail(email, container) {
        if (email.match(new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}")) == null) {
            return new ValidationResult(false, container, "Doesn't look like email"); 
        }
        return new ValidationResult(true, container, "Looks suitable!"); 
    }

    static validatePassword(password, container) {
        if (password.match(new RegExp("[0-9]")) == null) {
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

    static validateDOB(dob, container) {
        let currDate = new Date();
        let setDate = new Date(dob);
        let yearDiff = (currDate - setDate) / MILLISECONDS_IN_A_YEAR;
        if (isNaN(yearDiff)) {
            return new ValidationResult(false, container, "DOB should be set"); 
        }
        if (yearDiff < 0) {
            return new ValidationResult(false, container, "No timetravellers allowed"); 
        }
        if (yearDiff >= 100) {
            return new ValidationResult(false, container, "No country for old men"); 
        }
        if (yearDiff < 18) {
            return new ValidationResult(false, container, "Go ask your parents"); 
        } 
        return new ValidationResult(true, container, "Looks suitable!"); 
    }

    static validatePhone(phone, container) {
        if (phone.match(new RegExp("[+][7-8] \\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}")) == null) {
            return new ValidationResult(false, container, "Doesn't look like phone number"); 
        }
        return new ValidationResult(true, container, "Looks suitable!"); 
    }

    static validateNickname(nickname, container) {
        if (nickname.length <= 3) {
            return new ValidationResult(false, container, "Name should be longer than 6 symbols"); 
        }
        if (nickname.length >= 13) {
            return new ValidationResult(false, container, "Name shouldn't be longer than 13 symbols"); 
        }
        return new ValidationResult(true, container, "Looks suitable!"); 
    }

    static validatePostTitle(title, container) {
        if (title.length < 5) {
            return new ValidationResult(false, container, "Title shouldn't be shorter than 5 symbols"); 
        }
        if (title.length > 30) {
            return new ValidationResult(false, container, "Title shouldn't be longer than 30 symbols"); 
        }
        return new ValidationResult(true, container, "Looks suitable!"); 
    }

    static validateReadingTime(readingTime, container) {
        if (readingTime <= 0 || readingTime.length == 0) {
            return new ValidationResult(false, container, "Reading time must be positive"); 
        }
        if (readingTime > 500) {
            return new ValidationResult(false, container, "I ain't reading all dat"); 
        }
        return new ValidationResult(true, container, "Looks suitable!"); 

    }

    static validateImageURL(imageURL, container) {
        if (imageURL.match(new RegExp("https?:\/\/.*\.(?:png|jpg|jpeg|gif)$")) == null) {
            return new ValidationResult(false, container, "Doesn't look like image url"); 
        }
        return new ValidationResult(true, container, "Looks suitable!"); 
    }

    static validateTags(tags, container) {
        if (tags.length <= 0) {
            return new ValidationResult(false, container, "Choose at least one"); 
        } 
        return new ValidationResult(true, container, "Looks suitable!"); 
    }
}