module.exports = function (req) {
	var errors = {};
	
	if (!req.name) {
		errors["name"] = "Name field is required.";
	}
	
	if (!req.sequenceNumber) {
		errors["sequenceNumber"] = "Sequence number field is required.";
	}
	
	if (req.sequenceNumber && req.sequenceNumber <= 0) {
		errors["sequenceNumber"] = "Sequence number must be greater or equal than 1.";
	}
	
	return errors;
};