# Informe técnico: API REST de Gestión de Tareas

## 1. Objetivo y tecnologías
El proyecto implementa una API REST para administrar tareas mediante operaciones de creación, consulta, actualización y eliminación (CRUD). Se utilizaron Node.js y Express para el servidor, SQLite para la persistencia, express-session para el control de sesión y Socket.IO para comunicar cambios en tiempo real. La interfaz web permite comprobar el funcionamiento sin herramientas adicionales.

## 2. Arquitectura e implementación
La aplicación se organiza por capas para separar responsabilidades. `routes` define los endpoints HTTP; `services` valida y transforma los datos; `repositories` concentra las consultas SQL; `db.js` configura la base de datos; y `middleware` gestiona la sesión y los errores. Esta separación facilita el mantenimiento y evita mezclar reglas de negocio con operaciones de entrada/salida.

Las tareas contienen identificador, título, descripción, estado y fechas de creación y actualización. Los estados permitidos son pendiente, en progreso y completada. Se aplican validaciones de tipo y longitud. Las consultas SQL utilizan parámetros preparados, evitando construir instrucciones mediante concatenación de datos recibidos. Los errores se devuelven en un formato JSON uniforme.

## 3. Endpoints y respuestas
Los endpoints principales son `GET /api/tareas`, `GET /api/tareas/:id`, `POST /api/tareas`, `PUT /api/tareas/:id` y `DELETE /api/tareas/:id`. Se emplean códigos HTTP apropiados: 200 para consultas y actualizaciones correctas, 201 para creación, 400 para datos inválidos, 401 para sesión requerida, 404 para recursos inexistentes y 500 para errores internos.

Ejemplo de creación: `POST /api/tareas` con JSON `{"titulo":"Preparar informe","descripcion":"Documentar la API","estado":"pendiente"}`. La respuesta exitosa contiene el mensaje “Tarea creada” y el objeto guardado. Si el título no cumple la longitud mínima, se devuelve 400 con código `VALIDACION` y una lista de detalles.

## 4. Sesión, persistencia y tiempo real
El acceso a las rutas de tareas requiere iniciar sesión mediante `POST /api/sesion/iniciar`. Para la demostración se utiliza el usuario `estudiante` y la clave `123456`. SQLite conserva las tareas en el archivo `data/tareas.sqlite`. Socket.IO notifica a los clientes mediante los eventos `tarea:creada`, `tarea:actualizada` y `tarea:eliminada`, permitiendo refrescar la lista cuando ocurre un cambio.

## 5. Pruebas y conclusión
Las pruebas manuales recomendadas consisten en iniciar sesión, crear una tarea, listar tareas, consultar una tarea por ID, actualizar su estado, eliminarla y enviar datos inválidos para verificar el código 400. También se comprueba el 404 con un identificador inexistente y el requisito de sesión con una petición sin autenticación.

Se obtuvo una solución modular que integra CRUD, validación, persistencia, manejo uniforme de errores, sesiones y notificaciones en tiempo real. Las credenciales y el almacenamiento de sesión incluidos son exclusivamente demostrativos; antes de un uso público deben añadirse hash de contraseñas, almacenamiento persistente de sesiones, HTTPS y configuración segura mediante variables de entorno.
