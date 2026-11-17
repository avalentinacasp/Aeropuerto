// Error con código HTTP propio (400, 404, 409...)
class AppError extends Error {
    constructor(mensaje, status = 400) {
        super(mensaje);
        this.status = status;
    }
}

function manejarError(error, req, res, next) {
    console.error("Error:", error.message);

    // JSON mal formado en el body
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ mensaje: "El JSON enviado no es válido" });
    }

    const status = error.status || 500;

    res.status(status).json({
        mensaje: status === 500 ? "Error interno del servidor" : error.message
    });
}

module.exports = manejarError;
module.exports.AppError = AppError;
