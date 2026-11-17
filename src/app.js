const express = require("express");

const registrarPeticion = require("./middlewares/logger.middleware");
const manejarError = require("./middlewares/error.middleware");

const pilotRoutes = require("./routes/pilot.routes");
const airplaneRoutes = require("./routes/airplane.routes");
const assignmentRoutes = require("./routes/assignment.routes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(registrarPeticion);

app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API Aeropuerto funcionando",
        entidades: ["Pilotos", "Aviones", "Asignaciones"]
    });
});

app.use("/api/pilots", pilotRoutes);
app.use("/api/airplanes", airplaneRoutes);
app.use("/api/assignments", assignmentRoutes);

// Rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ mensaje: "La ruta solicitada no existe" });
});

app.use(manejarError);

app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log(" AEROPUERTO");
    console.log("--------------------------------");
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log("--------------------------------");
});
