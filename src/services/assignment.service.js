const assignmentModel = require("../models/assignment.model");
const pilotModel = require("../models/pilot.model");
const airplaneModel = require("../models/airplane.model");
const { AppError } = require("../middlewares/error.middleware");

const texto = v => typeof v === "string" && v.trim() !== "";

// Validar formato de los datos de una asignación
function validarFormato(d) {
    if (!Number.isInteger(d.idPiloto) || d.idPiloto <= 0) {
        throw new AppError("idPiloto debe ser un entero positivo");
    }
    if (!Number.isInteger(d.idAvion) || d.idAvion <= 0) {
        throw new AppError("idAvion debe ser un entero positivo");
    }
    if (!texto(d.fechaVuelo) || Number.isNaN(Date.parse(d.fechaVuelo))) {
        throw new AppError("fechaVuelo debe ser una fecha válida (ej: 2026-12-01)");
    }
    if (!texto(d.rutaAsignada)) {
        throw new AppError("La rutaAsignada es obligatoria");
    }

    return {
        idPiloto: d.idPiloto,
        idAvion: d.idAvion,
        fechaVuelo: d.fechaVuelo.trim(),
        rutaAsignada: d.rutaAsignada.trim()
    };
}

// Validación relacional: el piloto y el avión deben existir.
// Si alguno no existe se aborta la operación y se notifica el error.
async function validarRelaciones({ idPiloto, idAvion }) {
    const piloto = await pilotModel.buscarPorId(idPiloto);
    if (!piloto) {
        throw new AppError(`No existe un piloto con id ${idPiloto}`, 404);
    }

    const avion = await airplaneModel.buscarPorId(idAvion);
    if (!avion) {
        throw new AppError(`No existe un avión con id ${idAvion}`, 404);
    }
}

async function listar() {
    return await assignmentModel.listar();
}

async function obtenerPorId(id) {
    const asignacion = await assignmentModel.buscarPorId(id);
    if (!asignacion) throw new AppError("Asignación no encontrada", 404);
    return asignacion;
}

async function crear(datos) {
    const asignacion = validarFormato(datos);
    await validarRelaciones(asignacion);
    return await assignmentModel.crear(asignacion);
}

async function actualizar(id, datos) {
    await obtenerPorId(id);
    const asignacion = validarFormato(datos);
    await validarRelaciones(asignacion);
    return await assignmentModel.actualizar(id, asignacion);
}

async function eliminar(id) {
    await obtenerPorId(id);
    await assignmentModel.eliminar(id);
    return { mensaje: "Asignación eliminada correctamente" };
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
