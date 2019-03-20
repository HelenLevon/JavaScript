const btnSubmit = document.getElementById("submit");
const inputLogin = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");
const alertMsg = document.getElementById("alert");
const infoUser = document.getElementById("info-user");
const form = document.getElementById("form");
const btnShowPassword = document.getElementById('btnShowPassword');
const emailAddress = document.getElementById("emailAddress");
const passwordField = document.getElementById("passwordField");
const btnPreviousePage = document.getElementById("previousePage");
const userMenu = document.getElementById("menu");
const jsExpert = document.getElementById("jsExpert");
const btnGallery = document.getElementById("go_gallery");
const btnAboutUser = document.getElementById("go_about_user");
const btnExit = document.getElementById("go_exit");
const galleryContainer = document.getElementById("galleryContainer");

class LoginForm {
    constructor(validatorModule, galleryModule) {
        this.validator = validatorModule;
        this.gallery = galleryModule;
        this.flag = true;
        this.loginUrl = "http://localhost:3000/login";
        this.login = inputLogin;
        this.password = inputPassword;
        this._aboutHandler = (event) => { // public
            event.preventDefault();
            this.showBox("aboutUser")
            this.initPageAboutUser();
        };
        this._galleryHandler = (event) => {
            event.preventDefault();
            this.showBox("gallery");
        };
        this._exitHandler = (event) => {
            event.preventDefault();
            this.exitFromUserPage();
        }
        this._showPasswordHandler = () => {
            if (this.flag) {
                this.flag = !this.flag;
                this.showPassword(this.password.value);
                btnShowPassword.innerHTML = "Скрыть пароль";
            } else {
                this.flag = !this.flag;
                this.hidePassword(this.password.value);
                btnShowPassword.innerHTML = "Показать пароль";
            }
        };
        this.initEventOnce = true;
        if (this.initEventOnce) {
            this.initComponent();
            this.initEventOnce = !this.initEventOnce;
        }
    }
    initComponent() {
        btnSubmit.addEventListener("click", (event) => {
            event.preventDefault();
            this.validateUserData();
        });
        this.setLocalStorageData()
        this.gallery.galleryEventHandlers();
        this.initUserMenuListeners();
        this.initListenersAboutUser();

    };
    setLocalStorageData(email, password) {
        //localStorage.setItem("login", email);
        //localStorage.setItem("password", password);
        localStorage.setItem("status", "null")
    };
    initUserMenuListeners() {
        btnGallery.addEventListener('click', this._galleryHandler);
        btnAboutUser.addEventListener("click", this._aboutHandler);
        btnExit.addEventListener('click', this._exitHandler);
    };
    initListenersAboutUser() {
        btnShowPassword.addEventListener("click", this._showPasswordHandler)
    };
    async validateUserData() {
        let isCorrectData = this.validator.isCorrectData();
        if (isCorrectData) {
            let userData = {
                login: this.login.value,
                password: this.password.value
            };
            console.log(JSON.stringify(userData));
            const response = await fetch(this.loginUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (data.status === true) {
                this.setStatus("userTrue");
                this.showBox("gallery");
                this.showUserMenu();
                this.gallery.initComponentGallary();

            } else {
                this.validator.showOrHideAlert("visible", "Invalid user data!");
                setTimeout(this.validator.showOrHideAlert, 4000, "hidden");
            }
        }
    };
    setStatus(status) {
        localStorage.setItem("status", status);
    };
    showBox(btn) {
        btnGallery.classList.remove("btn-primary");
        btnAboutUser.classList.remove("btn-primary");
        btnExit.classList.remove("btn-primary");
        this.gallery.hideSelectedBlock(galleryContainer);
        this.gallery.hideSelectedBlock(form);
        this.gallery.hideSelectedBlock(infoUser);
        switch (btn) {
            case "gallery":
                btnGallery.classList.add("btn-primary");
                this.gallery.showSelectedBlock(galleryContainer);
                break;
            case "aboutUser":
                btnAboutUser.classList.add("btn-primary");
                this.gallery.showSelectedBlock(infoUser);
                
                break;
            case "exit":
                
                this.gallery.showSelectedBlock(form);
                break;
        }
    };
    showUserMenu() {
        userMenu.style.display = 'block';
    };
    hidePassword(passwordValue) {
        document.getElementById("passwordField").value = passwordValue;
        document.getElementById("passwordField").type = "password";
    };
    showPassword(passwordValue) {
        document.getElementById("passwordField").value = passwordValue;
        document.getElementById("passwordField").type = "text";
    };
    hideUserMenu() {
        userMenu.style.display = 'none';
    };
    initPageAboutUser() {
        emailAddress.value = this.login.value;
        btnShowPassword.innerHTML = "Show password";
        this.hidePassword(inputPassword.value);
    };
    exitFromUserPage() {
        this.showBox("exit");
        this.hideUserMenu();
        this.setStatus("null");
        spaceForGalary.innerHTML = " ";
        this.gallery.visibleGalary = [];
        this.gallery.newData = [];
        this.gallery.newDataCopy = [];
        countImages.innerHTML = "0";
    }
}
