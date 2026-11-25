# Acme School

Plataforma web para la gestion y resolucion de examenes academicos, desarrollada con HTML5, CSS3 y JavaScript Vanilla (ES6+, Web Components en Light DOM y persistencia en `localStorage` con JSON).

## Funcionalidades

- **Catalogo publico y resolucion de examenes (`index.html`):** busqueda por titulo o materia, inicio de evaluaciones con reloj en cuenta regresiva, envio automatico si se acaba el tiempo, calificacion inmediata, revision pregunta por pregunta e historial de resultados recientes.
- **Inicio de sesion (`login.html`):** autenticacion contra los usuarios almacenados en `localStorage` y proteccion de vistas privadas mediante `protegerRuta()`.
- **Gestion de usuarios (`usuarios.html`):** modulo privado con creacion, edicion, eliminacion, busqueda y validacion de correo unico.
- **Gestion de examenes y preguntas (`examenes.html`):** modulo privado para crear, editar y eliminar examenes, asi como administrar sus preguntas de opcion multiple y respuestas correctas.
- **Web Components reutilizables:** `<acme-navbar>`, `<acme-reloj>` y `<acme-tarjeta-examen>` implementados con `HTMLElement` en Light DOM.
- **Diseno responsivo Mobile First:** hoja de estilos unica (`css/estilos.css`) con adaptacion para movil, tablet (`768px`) y escritorio (`1024px`).

## Estructura del proyecto

```text
ProyectoAcmeschool_JavaScript_ArdilaJuan/
├── index.html
├── login.html
├── usuarios.html
├── examenes.html
├── css/
│   └── estilos.css
├── js/
│   ├── datos.js
│   ├── auth.js
│   ├── login.js
│   ├── usuarios.js
│   ├── examenes.js
│   ├── resolver.js
│   └── componentes/
│       ├── navbar.js
│       ├── reloj.js
│       └── tarjeta.js
└── README.md
```

## Como ejecutar el proyecto

Como el proyecto usa modulos nativos de JavaScript (`type="module"`), debe abrirse mediante un servidor local y no directamente con doble clic sobre el archivo HTML:

1. Clonar o abrir la carpeta `ProyectoAcmeschool_JavaScript_ArdilaJuan` en Visual Studio Code.
2. Iniciar la extension **Live Server** sobre `index.html` (o levantar cualquier servidor estatico local en la raiz del proyecto).
3. Navegar a `index.html` para resolver examenes o a `login.html` para entrar al panel de administracion.

## Usuarios iniciales de prueba

Al abrir la aplicacion por primera vez, `js/datos.js` carga automaticamente tres usuarios y tres examenes de ejemplo en `localStorage`:

| Rol | Correo | Contrasena |
| --- | --- | --- |
| Administrador | `admin@acmeschool.edu` | `admin123` |
| Docente | `docente@acmeschool.edu` | `docente123` |
| Estudiante | `carlos@acmeschool.edu` | `carlos123` |

## Autor

**Juan Jose Ardila Arevalo** (`JuanJArdilaA`)
