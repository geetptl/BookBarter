function validateUserId(userId) {
    let idRegex = /^[0-9]{1,}$/g;
    return idRegex.test(userId);
}

module.exports = {
    validateUserId,
};
