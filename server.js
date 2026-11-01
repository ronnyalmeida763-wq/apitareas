const express = require("express");
const session = require("express-session");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { initializeDatabase } = require("./src/db");
const taskRoutes = require("./src/routes/taskRoutes");
const { requireSession } = require("./src/middleware/requireSession");
const { errorHandler, notFound } = require("./src/middleware/errorHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

initializeDatabase();
app.use(express.json());
app.use(session({
  name: "api.sid",
  secret: process.env.SESSION_SECRET || "cambia-esta-clave-en-produccion",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: false, maxAge: 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, mensaje: "API Gestión de Tareas funcionando" });
});

app.post("/api/sesion/iniciar", (req, res, next) => {
  const { usuario, clave } = req.body || {};
  if (usuario !== "estudiante" || clave !== "123456") {
    return res.status(401).json({ error: { codigo: "CREDENCIALES_INVALIDAS", mensaje: "Usuario o clave incorrectos" } });
  }
  req.session.usuario = usuario;
  res.status(200).json({ mensaje: "Sesión iniciada", usuario });
});

app.get("/api/sesion", (req, res) => {
  if (!req.session.usuario) return res.status(401).json({ error: { codigo: "SESION_REQUERIDA", mensaje: "Inicia sesión para continuar" } });
  res.json({ usuario: req.session.usuario });
});

app.post("/api/sesion/cerrar", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("api.sid");
    res.status(200).json({ mensaje: "Sesión cerrada" });
  });
});

app.use("/api/tareas", requireSession, taskRoutes(io));
app.use(notFound);
app.use(errorHandler);

io.on("connection", () => {
  // Los clientes reciben eventos cuando una tarea cambia.
});

server.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
