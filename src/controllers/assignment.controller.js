const servicio = require("../services/assignment.service");

// Controlador de asignaciones: recibe la petición HTTP, llama al servicio y responde.

// GET /api/assignments - consultar todos
async function listar(req, res, next) {
    try {
        const datos = await servicio.listar();

        return res.status(200).json({
            mensaje: "Lista de asignaciones consultada correctamente",
            datos
        });
    } catch (error) {
        next(error);
    }
}

// GET /api/assignments/:id - consultar uno por ID
async function obtener(req, res, next) {
    try {
        const datos = await servicio.obtenerPorId(req.params.id);

        return res.status(200).json({
            mensaje: "Asignación encontrada",
            datos
        });
    } catch (error) {
        next(error);
    }
}

// POST /api/assignments - crear
async function crear(req, res, next) {
    try {
        const datos = await servicio.crear(req.body);

        return res.status(201).json({
            mensaje: "Asignación creada correctamente",
            datos
        });
    } catch (error) {
        next(error);
    }
}

// PUT /api/assignments/:id - actualizar
async function actualizar(req, res, next) {
    try {
        const datos = await servicio.actualizar(req.params.id, req.body);

        return res.status(200).json({
            mensaje: "Asignación actualizada correctamente",
            datos
        });
    } catch (error) {
        next(error);
    }
}

// DELETE /api/assignments/:id - eliminar
async function eliminar(req, res, next) {
    try {
        const resultado = await servicio.eliminar(req.params.id);

        return res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
