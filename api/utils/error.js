// * Define a function called errorHandler that takes in two parameters: statusCode and message
export const errorHandler = (statusCode, message) => {
    // ?Create a new instance of the Error object and assign it to the variable 'error'
    const error = new Error();

    // ? Set the 'statusCode' property of the 'error' object to the value of the 'statusCode' parameter
    error.statusCode = statusCode;

    // ? Set the 'message' property of the 'error' object to the value of the 'message' parameter
    error.message = message;

    // ! Return the 'error' object
    return error;
};
