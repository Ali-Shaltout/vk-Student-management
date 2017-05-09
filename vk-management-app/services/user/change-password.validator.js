module.exports = function (req) {
	var errors = {};
	
	if (!req.oldPassword) {
		errors["oldPassword"] = "Old password field is required.";
	}
	else if (req.oldPassword.length <= 5) {
		errors["oldPassword"] = "Old password length must contains more than 5 symbols.";
	}
	
	if (!req.newPassword) {
		errors["newPassword"] = "New password field is required.";
	}
	else if (req.newPassword.length <= 5) {
		errors["newPassword"] = "New password length must contains more than 5 symbols.";
	}
	
	if (!req.confirmPassword) {
		errors["confirmPassword"] = "Confirm password field is required.";
	}
	else if (req.confirmPassword.length <= 5) {
		errors["confirmPassword"] = "Confirm password length must contains more than 5 symbols.";
	}
	else if(req.newPassword !== req.confirmPassword) {
		errors["confirmPassword"] = "Confirm password field does not match with new password field.";
	}
	else if(req.oldPassword === req.confirmPassword) {
		errors["confirmPassword"] = "Confirm password field and old password field cannot be same.";
	}
	
	return errors;
};