// claves de guardado en localstorage
const CLAVE_USUARIOS = "acme_usuarios";
const CLAVE_EXAMENES = "acme_examenes";
const CLAVE_RESULTADOS = "acme_resultados";

// datos de prueba iniciales
const USUARIOS_INICIALES = [
  {
    id: 1,
    nombre: "Juan Jose Ardila",
    correo: "admin@acmeschool.edu",
    clave: "admin123",
    rol: "administrador",
    activo: true
  },
  {
    id: 2,
    nombre: "Laura Martinez",
    correo: "docente@acmeschool.edu",
    clave: "docente123",
    rol: "docente",
    activo: true
  },
  {
    id: 3,
    nombre: "Carlos Ramirez",
    correo: "carlos@acmeschool.edu",
    clave: "carlos123",
    rol: "estudiante",
    activo: true
  }
];

const EXAMENES_INICIALES = [
  {
    id: 1,
    titulo: "Fundamentos de JavaScript",
    materia: "Programacion",
    tiempo: 5,
    descripcion: "Conceptos basicos de variables, funciones y arreglos en JavaScript.",
    activo: true,
    preguntas: [
      {
        id: 1,
        enunciado: "Que palabra clave se usa para declarar una constante en JavaScript?",
        opciones: ["var", "const", "let", "static"],
        correcta: 1
      },
      {
        id: 2,
        enunciado: "Que metodo convierte un texto JSON en un objeto de JavaScript?",
        opciones: ["JSON.stringify()", "JSON.convert()", "JSON.parse()", "JSON.object()"],
        correcta: 2
      },
      {
        id: 3,
        enunciado: "Que metodo de arreglo devuelve un nuevo arreglo solo con los elementos que cumplen una condicion?",
        opciones: ["filter()", "push()", "forEach()", "join()"],
        correcta: 0
      },
      {
        id: 4,
        enunciado: "Que operador compara tanto el valor como el tipo de dato?",
        opciones: ["==", "=", "===", "!="],
        correcta: 2
      }
    ]
  },
  {
    id: 2,
    titulo: "HTML5 y Estructura Web",
    materia: "Desarrollo Web",
    tiempo: 4,
    descripcion: "Etiquetas semanticas, formularios y estructura base de una pagina HTML.",
    activo: true,
    preguntas: [
      {
        id: 1,
        enunciado: "Que etiqueta representa el contenido principal de una pagina?",
        opciones: ["<section>", "<main>", "<header>", "<aside>"],
        correcta: 1
      },
      {
        id: 2,
        enunciado: "Que atributo hace que un campo de formulario sea obligatorio?",
        opciones: ["validate", "must", "required", "checked"],
        correcta: 2
      },
      {
        id: 3,
        enunciado: "Que atributo se usa en una etiqueta <script> para habilitar import y export?",
        opciones: ['type="module"', 'mode="es6"', 'async="true"', 'rel="module"'],
        correcta: 0
      },
      {
        id: 4,
        enunciado: "Que etiqueta vincula un texto descriptivo con un campo de formulario?",
        opciones: ["<span>", "<legend>", "<label>", "<small>"],
        correcta: 2
      }
    ]
  },
  {
    id: 3,
    titulo: "CSS3 y Diseno Responsivo",
    materia: "Diseno Web",
    tiempo: 4,
    descripcion: "Modelo de caja, flexbox y media queries para adaptar el diseno a cada pantalla.",
    activo: true,
    preguntas: [
      {
        id: 1,
        enunciado: "Que propiedad incluye el padding y el borde dentro del ancho total de una caja?",
        opciones: ["box-sizing: border-box", "display: block", "overflow: hidden", "position: relative"],
        correcta: 0
      },
      {
        id: 2,
        enunciado: "Que enfoque de diseno comienza por los estilos de celular y escala a pantallas mas grandes?",
        opciones: ["Desktop First", "Grid First", "Mobile First", "Fixed Layout"],
        correcta: 2
      },
      {
        id: 3,
        enunciado: "Que propiedad de Flexbox alinea los elementos en el eje principal?",
        opciones: ["align-items", "justify-content", "flex-wrap", "gap"],
        correcta: 1
      },
      {
        id: 4,
        enunciado: "En que selector se suelen declarar las variables globales de CSS?",
        opciones: ["body", ":root", "html-vars", "*"],
        correcta: 1
      }
    ]
  }
];

// traer datos guardados de forma segura
function leerStorage(clave) {
  const texto = localStorage.getItem(clave);
  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch (error) {
    return null;
  }
}

function guardarStorage(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

// cargar datos iniciales si no existen todavia
export function inicializarDatos() {
  const usuarios = leerStorage(CLAVE_USUARIOS);
  if (!Array.isArray(usuarios)) {
    guardarStorage(CLAVE_USUARIOS, USUARIOS_INICIALES);
  }

  const examenes = leerStorage(CLAVE_EXAMENES);
  if (!Array.isArray(examenes)) {
    guardarStorage(CLAVE_EXAMENES, EXAMENES_INICIALES);
  }

  const resultados = leerStorage(CLAVE_RESULTADOS);
  if (!Array.isArray(resultados)) {
    guardarStorage(CLAVE_RESULTADOS, []);
  }
}

export function generarId(lista) {
  let mayor = 0;
  lista.forEach(function (item) {
    if (item.id > mayor) {
      mayor = item.id;
    }
  });
  return mayor + 1;
}

export function obtenerUsuarios() {
  const usuarios = leerStorage(CLAVE_USUARIOS);
  if (Array.isArray(usuarios)) {
    return usuarios;
  }
  return [];
}

export function guardarUsuarios(usuarios) {
  guardarStorage(CLAVE_USUARIOS, usuarios);
}

export function obtenerExamenes() {
  const examenes = leerStorage(CLAVE_EXAMENES);
  if (Array.isArray(examenes)) {
    return examenes;
  }
  return [];
}

export function guardarExamenes(examenes) {
  guardarStorage(CLAVE_EXAMENES, examenes);
}

export function obtenerResultados() {
  const resultados = leerStorage(CLAVE_RESULTADOS);
  if (Array.isArray(resultados)) {
    return resultados;
  }
  return [];
}

export function guardarResultado(resultado) {
  const resultados = obtenerResultados();
  resultados.unshift(resultado);
  guardarStorage(CLAVE_RESULTADOS, resultados);
}
