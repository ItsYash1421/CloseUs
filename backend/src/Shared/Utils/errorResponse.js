const errorResponse = (message, statusCode = 500) => {
    return {
        success: false,
        message,
        statusCode
    };
};

module.exports = errorResponse;
