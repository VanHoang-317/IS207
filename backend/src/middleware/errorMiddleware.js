const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace internally

    // Send a sanitized JSON response to the client
    res.status(err.status || 500).json({
        message: err.message || 'Server Error',
        // Only include the stack trace in development mode for easier debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorMiddleware;
