module.exports = function (req) {
	var errors = {};
	
	if (!req.roleId) {
		errors["roleId"] = "Role field is required.";
	}
	
	if (!req.firstname) {
		errors["firstname"] = "Firstname field is required.";
	}
	
	if (!req.lastname) {
		errors["lastname"] = "Lastname field is required.";
	}
	
	if (!req.email) {
		errors["email"] = "Email field is required.";
	}
	else if (!validateEmail(req.email)) {
		errors["email"] = "Email format is incorrect.";
	}
	
	if (!req.password) {
		errors["password"] = "Password field is required.";
	}
	else if (req.password.length <= 5) {
		errors["password"] = "Password length must contains more than 5 symbols.";
	}
	
	if (!req.confirmPassword) {
		errors["confirmPassword"] = "Confirm password field is required.";
	}
	else if (req.confirmPassword.length <= 5) {
		errors["confirmPassword"] = "Password length must contains more than 5 symbols.";
	}
	else if(req.password !== req.confirmPassword) {
		errors["confirmPassword"] = "Confirm password field does not match with password field.";
	}
	
	return errors;
};

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}