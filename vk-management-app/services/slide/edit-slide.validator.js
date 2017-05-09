module.exports = function (req) {
	var errors = {};
	
	if (!req.title) {
		errors["title"] = "Title field is required.";
	}
	
	if (!req.description) {
		errors["description"] = "Description field is required.";
	}
	
	if (!req.answer) {
		errors["answer"] = "Answer field is required.";
	}
	
	if (!req.sequenceNumber) {
		errors["sequenceNumber"] = "Sequence number field is required.";
	}
	
	if (req.sequenceNumber && req.sequenceNumber <= 0) {
		errors["sequenceNumber"] = "Sequence number must be greater or equal than 1.";
	}
	
	return errors;
};