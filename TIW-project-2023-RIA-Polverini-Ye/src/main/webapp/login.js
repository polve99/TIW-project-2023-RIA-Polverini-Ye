const login = () => {
	document.getElementById("loginButton").addEventListener('click', (e) => {
		let form = e.target.closest("form");
		resetInputFieldsAndMessages();
		let formValidity = form.checkValidity();
		if (formValidity && checkLogin(form)) {
			makeCall("POST", "Login", form, function(response) {
				let message = response.responseText;
				if (response.readyState == XMLHttpRequest.DONE && response.status == 200) {
					sessionStorage.setItem("userMail", message);
					window.location.href = "home.html";
				} else if(response.readyState == XMLHttpRequest.DONE && response.status !== 200){
      				document.getElementById("loginErrorMessage").textContent = message;
			        document.getElementById("loginUser").className = "inputWithError";
			        document.getElementById("loginPsw").className = "inputWithError";
				}
			});
		} else {
			form.reportValidity();
			form.reset();
		}
	});
	document.getElementById("registerAnchor").addEventListener("click", () => {
		document.getElementById("loginSection").className = "hiddenElement";
		document.getElementById("registrationSection").className = "registrationContainer";
		document.getElementById("logmsg").className = "hiddenmsg";
		document.getElementById("regmsg").className = "msg";
		resetInputFieldsAndMessages();
		document.getElementById("login").reset();
	});
};

const registration = () => {
	document.getElementById("registrationButton").addEventListener('click', (e) => {
		let form = e.target.closest("form");
		resetInputFieldsAndMessages();
		let formValidity = form.checkValidity();
		if (formValidity && checkRegistration(form)) {
			makeCall("POST", "Registration", form, function(response) {
				let message = response.responseText;
				if (response.readyState == XMLHttpRequest.DONE && response.status == 200) {
					sessionStorage.setItem("userMail", message);
					window.location.href = "home.html";
				} else if(response.readyState == XMLHttpRequest.DONE && response.status !== 200){
      				document.getElementById("registrationErrorMessage").textContent = message;
				}
			});
		} else {
			form.reportValidity();
			form.reset();
		}
	});
	document.getElementById("loginAnchor").addEventListener("click", () => {
		document.getElementById("registrationSection").className = "hiddenElement";
		document.getElementById("loginSection").className = "loginContainer";
		document.getElementById("regmsg").className = "hiddenmsg";
		document.getElementById("logmsg").className = "msg";
		resetInputFieldsAndMessages();
		document.getElementById("registration").reset();
	});
};

const checkRegistration = (registrationForm) => {
	let formData = new FormData(registrationForm);
	let name = formData.get("name");
	let surname = formData.get("surname");
	let email = formData.get("userMail");
	let password = formData.get("password");
	let repeatedPassword = formData.get("repeatedPassword");
	let telephone = formData.get("telephone");
	let address = formData.get("address");
	let telephonePattern = /\\d+/;
	let telValid = false;
	let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	let emailValid = false;
	
	if (telephone.length>0) {
	  telValid = telephonePattern.test(telephone);
	}
	if (email != null) {
	  emailValid = emailPattern.test(email);
	}
	if(name.length<2 || name.length>20){
		document.getElementById("registrationErrorMessage").textContent = "Name must be between 2 and 20 characters";
		document.getElementById("nameInput").className = "inputWithError";
		return false;
	} else if(surname.length<2 || surname.length>20){
		document.getElementById("registrationErrorMessage").textContent = "Surname must be between 2 and 20 characters";
		document.getElementById("surnameInput").className = "inputWithError";
		return false;
	} else if(!emailValid ||email.length<5 || email.length>50){
		document.getElementById("registrationErrorMessage").textContent = "Invalid email. Email must be between 5 and 50 characters and have a valid format (e.g., email@mail.com)";
		document.getElementById("emailInput").className = "inputWithError";
		return false;
	} else if (password.length<8 || password.legth>50) {
		document.getElementById("registrationErrorMessage").textContent = "Password must be between 8 and 50 characters";
		document.getElementById("passwordInput").className = "inputWithError";
		return false;
	} else if (password != repeatedPassword) {
		document.getElementById("registrationErrorMessage").textContent = "Password and repeated password do not match";
		document.getElementById("passwordInput").className = "inputWithError";
		document.getElementById("repeatPasswordInput").className = "inputWithError";
		return false;
	} else if (address.length<1 || address.legth>50) {
		document.getElementById("registrationErrorMessage").textContent = "Address must be between 1 and 50 characters";
		document.getElementById("addressInput").className = "inputWithError";
		return false;
	} else if (telephone.length>0 && !telValid) {
		document.getElementById("registrationErrorMessage").textContent = "Telephone number not valid";
		document.getElementById("telephone").className = "inputWithError";
		return false;
	} else {
		return true;
	}
};

const checkLogin = (loginForm) => {
	let formData = new FormData(loginForm);
	let email = formData.get("userMail");
	let password = formData.get("password");
	let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	let emailValid = false;
	
	if (email != null) {
	  emailValid = emailPattern.test(email);
	}
	if(!emailValid ||email.length <2 || email.length>50){
		document.getElementById("loginErrorMessage").textContent = "Invalid email. Email must be between 5 and 50 characters and have a valid format (e.g., email@mail.com)";
		document.getElementById("loginUser").className = "inputWithError";
		return false;
	} else if (password.length < 8 || password.legth>50) {
		document.getElementById("loginErrorMessage").textContent = "Password must be between 8 and 50 characters";
		document.getElementById("loginPsw").className = "inputWithError";
		return false;
	} else {
		return true;
	}
};

const resetInputFieldsAndMessages = () => {
	let previousErrorFields = document.getElementsByClassName("inputWithError");
	let elementsLength = previousErrorFields.length;
	for (let i = 0; i < elementsLength; i++) {
		previousErrorFields[0].className = "";
	}
	document.getElementById("loginErrorMessage").innerHTML = "";
	document.getElementById("registrationErrorMessage").innerHTML = "";
};

const main = () => {
	login();
	registration();
};

main();