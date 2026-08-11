// Custom Error for api
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

// Handles the middleware routes if fails throws an error in catch block 