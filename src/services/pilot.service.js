const pilotModel = require("../models/pilot.model");
const assignmentModel = require("../models/assignment.model");
const { AppError } = require("../middlewares/error.middleware");

const texto = v => typeof v === "string" && v.trim() !== "";

// Validar los datos de un piloto
function validar(d) {
    if (!texto(d.nombre)) throw new AppError("El nombre es obligatorio");
    if (!texto(d.licencia)) throw new AppError("La licencia es obligatoria");
    if (typeof d.horasVuelo !== "number" || d.horasVuelo < 0) {
        throw new AppError("horasVuelo debe ser un número mayor o igual a 0");
    }
    if (!texto(d.estado)) throw new AppError("El estado es obligatorio");

    return {
        nombre: d.nombre.trim(),
        licencia: d.licencia.trim(),
        horasVuelo: d.horasVuelo,
        estado: d.estado.trim()
    };
}

// La licencia no puede repetirse
async function validarLicenciaUnica(licencia, idActual) {
    const existente = await pilotModel.buscarPorCampo("licencia", licencia);
    if (existente && existente.id !== Number(idActual)) {
        throw new AppError("Ya existe un piloto con esa licencia", 409);
    }
}

async function listar() {
    return await pilotModel.listar();
}

async function obtenerPorId(id) {
    const piloto = await pilotModel.buscarPorId(id);
    if (!piloto) throw new AppError("Piloto no encontrado", 404);
    return piloto;
}

async function crear(datos) {
    const piloto = validar(datos);
    await validarLicenciaUnica(piloto.licencia);
    return await pilotModel.crear(piloto);
}

async function actualizar(id, datos) {
    await obtenerPorId(id);
    const piloto = validar(datos);
    await validarLicenciaUnica(piloto.licencia, id);
    return await pilotModel.actualizar(id, piloto);
}

async function eliminar(id) {
    await obtenerPorId(id);

    // No se puede borrar un piloto que tiene asignaciones
    const asignaciones = await assignmentModel.listar();
    if (asignaciones.some(a => a.idPiloto === Number(id))) {
        throw new AppError("No se puede eliminar: el piloto tiene asignaciones", 409);
    }

    await pilotModel.eliminar(id);
    return { mensaje: "Piloto eliminado correctamente" };
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
