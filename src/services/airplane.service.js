const airplaneModel = require("../models/airplane.model");
const assignmentModel = require("../models/assignment.model");
const { AppError } = require("../middlewares/error.middleware");

const texto = v => typeof v === "string" && v.trim() !== "";

// Validar los datos de un avión
function validar(d) {
    if (!texto(d.modelo)) throw new AppError("El modelo es obligatorio");
    if (!texto(d.matricula)) throw new AppError("La matrícula es obligatoria");
    if (!Number.isInteger(d.capacidadMaxima) || d.capacidadMaxima <= 0) {
        throw new AppError("capacidadMaxima debe ser un entero mayor a 0");
    }
    if (!texto(d.fabricante)) throw new AppError("El fabricante es obligatorio");

    return {
        modelo: d.modelo.trim(),
        matricula: d.matricula.trim(),
        capacidadMaxima: d.capacidadMaxima,
        fabricante: d.fabricante.trim()
    };
}

// La matrícula no puede repetirse
async function validarMatriculaUnica(matricula, idActual) {
    const existente = await airplaneModel.buscarPorCampo("matricula", matricula);
    if (existente && existente.id !== Number(idActual)) {
        throw new AppError("Ya existe un avión con esa matrícula", 409);
    }
}

async function listar() {
    return await airplaneModel.listar();
}

async function obtenerPorId(id) {
    const avion = await airplaneModel.buscarPorId(id);
    if (!avion) throw new AppError("Avión no encontrado", 404);
    return avion;
}

async function crear(datos) {
    const avion = validar(datos);
    await validarMatriculaUnica(avion.matricula);
    return await airplaneModel.crear(avion);
}

async function actualizar(id, datos) {
    await obtenerPorId(id);
    const avion = validar(datos);
    await validarMatriculaUnica(avion.matricula, id);
    return await airplaneModel.actualizar(id, avion);
}

async function eliminar(id) {
    await obtenerPorId(id);

    // No se puede borrar un avión que tiene asignaciones
    const asignaciones = await assignmentModel.listar();
    if (asignaciones.some(a => a.idAvion === Number(id))) {
        throw new AppError("No se puede eliminar: el avión tiene asignaciones", 409);
    }

    await airplaneModel.eliminar(id);
    return { mensaje: "Avión eliminado correctamente" };
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
