 
 const login = () => {
	document.getElementById("loginButton").addEventListener('click', (e) => {
		let form = e.target.closest("form");
		resetInputFieldsAndMessages();
		if (form.checkValidity()) {
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
				}else if(response.readyState == XMLHttpRequest.DONE && response.status !== 200){
      				document.getElementById("registrationErrorMessage").textContent = message;
				}
			});
		} else if (!formValidity){
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
	var formData = new FormData(registrationForm);
	var password = formData.get("password");
	var repeatedPassword = formData.get("repeatedPassword");
	var email = formData.get("email");
	if (password.length < 8) {
		document.getElementById("registrationErrorMessage").textContent = "Password is too short";
		document.getElementById("passwordInput").className = "inputWithError";
		return false;
	} else if (password != repeatedPassword) {
		document.getElementById("registrationErrorMessage").textContent = "Password and repeated password are different";
		document.getElementById("passwordInput").className = "inputWithError";
		document.getElementById("repeatPasswordInput").className = "inputWithError";
		return false;
	} else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return true;
	} else {
		document.getElementById("emailInput").className = "inputWithError";
		document.getElementById("registrationErrorMessage").textContent = "Email is not valid";
		return false;
	}
};

const resetInputFieldsAndMessages = () => {
	var previousErrorFields = document.getElementsByClassName("inputWithError");
	var elementsLength = previousErrorFields.length;
	for (var i = 0; i < elementsLength; i++) {
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