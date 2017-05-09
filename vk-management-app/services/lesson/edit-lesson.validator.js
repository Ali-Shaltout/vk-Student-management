module.exports = function (req) {
	var errors = {};
	
	if (!req.name) {
		errors["name"] = "Name field is required.";
	}
	
	if (!req.description) {
		errors["description"] = "Description field is required.";
	}
	
	if (!req.programmingLanguageId) {
		errors["programmingLanguageId"] = "Programming language field is required.";
	}
	
	if (!req.levelId) {
		errors["levelId"] = "Level field is required.";
	}
	
	return errors;
};