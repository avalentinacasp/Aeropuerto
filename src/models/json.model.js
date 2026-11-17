const fs = require("fs/promises");
const path = require("path");

// Carpeta donde se guardan los archivos JSON
const DATA_PATH = path.join(__dirname, "../data");

// Leer un archivo JSON (si no existe, lo crea vacío)
async function leerArchivo(archivo) {
    const ruta = path.join(DATA_PATH, archivo);

    try {
        const contenido = await fs.readFile(ruta, "utf8");
        return contenido.trim() ? JSON.parse(contenido) : [];
    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.writeFile(ruta, "[]", "utf8");
            return [];
        }
        throw error;
    }
}

// Guardar datos en un archivo JSON
async function guardarArchivo(archivo, datos) {
    const ruta = path.join(DATA_PATH, archivo);
    await fs.writeFile(ruta, JSON.stringify(datos, null, 4), "utf8");
    return datos;
}

// Crea las funciones de acceso a datos de una entidad.
// Es la ÚNICA capa que toca el sistema de archivos.
function crearModelo(archivo, campoId) {

    async function listar() {
        return await leerArchivo(archivo);
    }

    async function buscarPorId(id) {
        const registros = await listar();
        return registros.find(r => r[campoId] === Number(id)) || null;
    }

    async function buscarPorCampo(campo, valor) {
        const registros = await listar();
        return registros.find(r => r[campo] === valor) || null;
    }

    async function crear(datos) {
        const registros = await listar();

        const nuevo = {
            [campoId]: registros.length
                ? Math.max(...registros.map(r => r[campoId])) + 1
                : 1,
            ...datos
        };

        registros.push(nuevo);
        await guardarArchivo(archivo, registros);
        return nuevo;
    }

    async function actualizar(id, datos) {
        const registros = await listar();
        const indice = registros.findIndex(r => r[campoId] === Number(id));

        if (indice === -1) return null;

        registros[indice] = { [campoId]: registros[indice][campoId], ...datos };
        await guardarArchivo(archivo, registros);
        return registros[indice];
    }

    async function eliminar(id) {
        const registros = await listar();
        const indice = registros.findIndex(r => r[campoId] === Number(id));

        if (indice === -1) return false;

        registros.splice(indice, 1);
        await guardarArchivo(archivo, registros);
        return true;
    }

    return { listar, buscarPorId, buscarPorCampo, crear, actualizar, eliminar };
}

module.exports = { leerArchivo, guardarArchivo, crearModelo };
