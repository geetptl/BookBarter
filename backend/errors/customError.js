class CustomError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message, field: this.field }];
    }
}

module.exports = CustomError;  