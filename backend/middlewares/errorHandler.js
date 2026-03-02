// Global error handler to catch unhandled errors and format the JSON response centrally

const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export default errorHandler;
