module.exports = function (req) {
	var errors = {};
	
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
	
	return errors;
};

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}