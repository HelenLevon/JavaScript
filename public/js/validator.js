class Validator {
    constructor() {
    }
    isCorrectData() {
        let checkFormResult = this.checkForm();
        let checkLoginResult = this.checkLogin(checkFormResult);
        let checkPasswordResult = this.checkPassword(checkLoginResult);
        let checkAllFormResult = checkPasswordResult;
                return checkAllFormResult;
    };
    checkForm() {
            if (inputLogin.value.length == 0 || inputPassword.value.length == 0) {
            this.showOrHideAlert("visible", "It is necessary to fill in all fields!");
            setTimeout(this.showOrHideAlert, 4000, "hidden");
            return false;
        } else {
            return true;
        }
    };
    checkLogin(previousResult) {
        if (previousResult) {
            let regular = /\S+@\S+\.\S+/;
            if (!regular.test(inputLogin.value)) {
                this.showOrHideAlert("visible", "Wrong login format!");
                setTimeout(this.showOrHideAlert, 4000, "hidden");
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };
    checkPassword(previousResult) {
        let regularExpression = /^[a-zA-Z]+$/;
        if (previousResult) {
            if (inputPassword.value.length < 5) {
                this.showOrHideAlert("visible", "Password must contain > then \
                5 symbols!");
                setTimeout(this.showOrHideAlert, 4000, "hidden");
                return false;
            } else {
                if (regularExpression.test(inputPassword.value)) {
                    this.showOrHideAlert("visible", "Password must contain \
                     at least one digit or special character!");
                    setTimeout(this.showOrHideAlert, 4000, "hidden");
                    return false;
                }
                return true;
            }
        } else {
            return false;
        }
    };
    showOrHideAlert(visability, text) {
        switch (visability) {
            case "visible":
                alertMsg.style.visibility = 'visible';
                alertMsg.innerHTML = text;
                break;
            case "hidden":
                alertMsg.style.visibility = 'hidden';
                break;
        }
    }
}