const errorMiddleware = (err, req, res, next) => {
    // Luôn log lỗi ra terminal để mình dễ theo dõi khi demo
    console.error("Lỗi hệ thống:", err.message); 

    // Trả về lỗi đơn giản cho Frontend
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Có lỗi xảy ra ở Server!',
    });
};

module.exports = errorMiddleware;