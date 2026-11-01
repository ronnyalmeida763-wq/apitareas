# API Gestión de Tareas

API REST académica desarrollada con Node.js, Express, SQLite y Socket.IO.

## Requisitos
- Node.js LTS
- npm

## Instalación y ejecución
En la terminal, dentro de esta carpeta:
```bash
npm install
npm start
```
Abrir http://localhost:3000

## Acceso de demostración
- Usuario: `estudiante`
- Clave: `123456`

## Endpoints
Primero iniciar sesión con `POST /api/sesion/iniciar`. El navegador conserva la cookie de sesión.

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/health` | Comprobar servidor |
| POST | `/api/sesion/iniciar` | Iniciar sesión |
| GET | `/api/sesion` | Consultar sesión |
| POST | `/api/sesion/cerrar` | Cerrar sesión |
| GET | `/api/tareas` | Listar tareas |
| GET | `/api/tareas/:id` | Consultar una tarea |
| POST | `/api/tareas` | Crear tarea |
| PUT | `/api/tareas/:id` | Actualizar tarea |
| DELETE | `/api/tareas/:id` | Eliminar tarea |

## Ejemplo de petición
`POST /api/tareas` con `Content-Type: application/json`:
```json
{
  "titulo": "Preparar informe",
  "descripcion": "Documentar los endpoints de la API",
  "estado": "pendiente"
}
```

Estados permitidos: `pendiente`, `en progreso`, `completada`.
La API responde con JSON uniforme. Los errores incluyen `error.codigo`, `error.mensaje` y, cuando aplica, `error.detalles`.

## Persistencia y organización
SQLite guarda los datos en `data/tareas.sqlite`. La carpeta `data/` se crea automáticamente y no se sube a GitHub. El código separa rutas, servicios, repositorio, base de datos y middleware. Las consultas SQL usan parámetros para evitar concatenar datos del usuario.

## Tiempo real
Socket.IO emite `tarea:creada`, `tarea:actualizada` y `tarea:eliminada` cuando se modifica una tarea.

## Pruebas manuales
1. Iniciar sesión desde la página.
2. Crear una tarea con título de al menos 3 caracteres.
3. Consultar `GET /api/tareas`.
4. Marcarla como completada.
5. Eliminarla.
6. Probar un título vacío para comprobar el error 400 y consultar un ID inexistente para comprobar el 404.

## Nota académica
Las credenciales son únicamente de demostración. Para un despliegue real se debe usar almacenamiento de sesiones persistente, contraseñas con hash, HTTPS, variables de entorno y protección adicional contra ataques web.
