const express = require("express");

const controlador = require("../controllers/airplane.controller");
const validarId = require("../middlewares/ValidarId.middleware");
const validarBody = require("../middlewares/ValidarBody.middleware");

const router = express.Router();

// Rutas de aviones
router.get("/", controlador.listar);
router.get("/:id", validarId, controlador.obtener);
router.post("/", validarBody, controlador.crear);
router.put("/:id", validarId, validarBody, controlador.actualizar);
router.delete("/:id", validarId, controlador.eliminar);

module.exports = router;
