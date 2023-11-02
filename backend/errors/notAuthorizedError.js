const { CustomError } = require("./custom-error");

class NotAuthorizedError extends CustomError {
    constructor() {
        super("Not Authorized");
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors() {
        return [{ message: "Not authorized" }];
    }
}

module.exports = NotAuthorizedError;
