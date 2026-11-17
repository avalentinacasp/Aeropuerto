const servicio = require("../services/airplane.service");

// Controlador de aviones: recibe la petición HTTP, llama al servicio y responde.

// GET /api/airplanes - consultar todos
async function listar(req, res, next) {
    try {
        const datos = await servicio.listar();

        return res.status(200).json({
            mensaje: "Lista de aviones consultada correctamente",
            datos
        });
    } catch (error) {
        next(error);
    }
}

// GET /api/airplanes/:id - consultar uno por ID
async function obtener(req, res, next) {
    try {
        const datos = await servicio.obtenerPorId(req.params.id);

        return res.status(200).json({
            mensaje: "Avión encontrado",
            datos
        });
    } catch (error) {
        next(error);
    }
}

// POST /api/airplanes - crear
async function crear(req, res, next) {
    try {
        const datos = await servicio.crear(req.body);

        return res.status(201).json({
            mensaje: "Avión creado correctamente",
            datos
        });
    } catch (error) {
        next(error);
    }
}

// PUT /api/airplanes/:id - actualizar
async function actualizar(req, res, next) {
    try {
        const datos = await servicio.actualizar(req.params.id, req.body);

        return res.status(200).json({
            mensaje: "Avión actualizado correctamente",
            datos
        });
    } catch (error) {
        next(error);
    }
}

// DELETE /api/airplanes/:id - eliminar
async function eliminar(req, res, next) {
    try {
        const resultado = await servicio.eliminar(req.params.id);

        return res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
