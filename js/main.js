// Comprobar compatibilidad del navegador

if (typeof (Storage) == "undefined") {
  var AlertaIncompatibilidad = new bootstrap.Modal(document.getElementById('BurbujaAlertaIncompatibilidad'))
  AlertaIncompatibilidad.toggle()
}

// Alertas

function AlertaEliminarDatos() {
  var AlertaEliminarDatos = new bootstrap.Modal(document.getElementById('AlertaEliminarDatos'))
  AlertaEliminarDatos.toggle()
}
function AlertaInputError() {
  var InputError = new bootstrap.Modal(document.getElementById('InputError'))
  InputError.toggle()
}
function AlertaCategoriaExistente() {
  var AlertaCategoriaExistente = new bootstrap.Modal(document.getElementById('AlertaCategoriaExistente'))
  AlertaCategoriaExistente.toggle()
}

function AlertaSinCategoriaExistente() {
  var AlertaCategoriaExistente = new bootstrap.Modal(document.getElementById('AlertaSinCategorias'))
  AlertaCategoriaExistente.toggle()
}

function AlertaSinPreguntas() {
  var AlertaCategoriaExistente = new bootstrap.Modal(document.getElementById('AlertaSinPreguntas'))
  AlertaCategoriaExistente.toggle()
}

function EliminarDatos() {
  localStorage.clear()
  location.reload();
}

function CrearFormularioCrearPreguntas() {
  //Si no existe ninguna categoría guardada mostramos un input para añadir una
  if (localStorage.getItem("Categorias") === null) {
    FormularioAñadirCategoria()
  } else {
    MenuCrearYSeleccionarCategoria()
  }
}

function CrearFormularioContestarPreguntas() {
  //Si no existe ninguna categoría guardada mostramos un input para añadir una
  if (localStorage.getItem("Categorias") === null) {
    AlertaSinCategoriaExistente()
  } else {
    MenuSeleccionarCategoriaParaPreguntar()
  }
}

function MenuSeleccionarCategoriaParaPreguntar() {
  var ArrayCategorias = JSON.parse(LZString.decompress(localStorage.getItem("Categorias")))
  var listaCategorias = null
  ArrayCategorias.forEach(ListarCategorias);

  document.getElementById("SelectCategoria").innerHTML = listaCategorias;
  document.getElementById("SelectCategoria").removeAttribute("disabled");
  document.getElementById("Empezar").removeAttribute("disabled");

  function ListarCategorias(item, index) {
    if (listaCategorias === null) {
      listaCategorias = '<option value="' + index + '">' + item + '</option>'
    } else {
      listaCategorias = listaCategorias.concat('<option value="', index, '">', item, '</option>')
    }
  }
}

function ComprimirEntrada() {
  var string = "This is my compression test.";
  alert("Size of sample is: " + string.length);
  var compressed = LZString.compress(string);
  alert("Size of compressed sample is: " + compressed.length);
  string = LZString.decompress(compressed);
  alert("Sample is: " + string);
}

function PrimeraLetraMayuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function MandarCategoria() {
  var categoria = document.getElementById('categoria').value;
  if (categoria) {
    AñadirCategoriaLocalStorage(PrimeraLetraMayuscula(categoria))
  } else {
    AlertaInputError()
  }
}

// Crear formulario para añadir categoría
function FormularioAñadirCategoria() {
  document.getElementById("formulario").innerHTML = '<div class="card mb-4 rounded-3 shadow-sm"> <div class="card-header py-3"> <h4 class="my-0 fw-normal">Crea tu primera categoría</h4> </div> <div class="card-body"><input type="text" id="categoria" class="form-control" aria-label="Username" aria-describedby="basic-addon1"><div class="pricing-header p-3 pb-md-4 mx-auto text-center"></div><button type="button" class="w-100 btn btn-lg btn-outline-primary" onclick="MandarCategoria()">Crear</button></div> </div>';
}

function MenuCrearYSeleccionarCategoria() {
  var MenuParte1 = '<div class="row g-3"> <div class="col-md"> <div class="form-floating"> <input type="text" class="form-control" id="categoria" placeholder="" value="" aria-describedby="button-addon2"> <label for="categoria">Crear nueva categoría</label> </div> </div> <div class="col-md"> <div class="form-floating"> <select class="form-select" id="CategoriaSeleccionada" onchange="MenuListaPreguntas()" aria-label="Floating label select">'
  var MenuParte2 = '</select> <label for="CategoriaSeleccionada">Selecciona una categoría</label> </div> </div> </div>'
  var listaCategorias = null



  var ArrayCategorias = JSON.parse(LZString.decompress(localStorage.getItem("Categorias")))
  ArrayCategorias.forEach(ListarCategorias);

  document.getElementById("formulario").innerHTML = MenuParte1 + listaCategorias + MenuParte2;

  MenuListaPreguntas()

  function ListarCategorias(item, index) {
    if (listaCategorias === null) {
      listaCategorias = '<option value="' + index + '">' + item + '</option>'
    } else {
      listaCategorias = listaCategorias.concat('<option value="', index, '">', item, '</option>')
    }
  }

  //Al presionar enter mandamos la nueva categoría a LocalStorage
  document.getElementById("categoria").addEventListener("keyup", function (event) {
    if (event.code === "Enter") {
      MandarCategoria();
      CrearFormularioCrearPreguntas();
      return false;
    }
  });


}


function MenuListaPreguntas() {
  var IDCategoriaSeleccionada = document.getElementById("CategoriaSeleccionada").value
  var NombreCategoriaSeleccionada = JSON.parse(LZString.decompress(localStorage.getItem("Categorias")))[IDCategoriaSeleccionada]

  if (localStorage.getItem("Preguntas-" + NombreCategoriaSeleccionada) === null) {
    PrimeraPregunta();
  } else {
    document.getElementById("ListaPreguntas").innerHTML = ""
    var ArrayPreguntas = JSON.parse(LZString.decompress(localStorage.getItem("Preguntas-" + NombreCategoriaSeleccionada)))
    var ArrayRespuestas = JSON.parse(LZString.decompress(localStorage.getItem("Respuestas-" + NombreCategoriaSeleccionada)))
    for (let i = 0; i < ArrayPreguntas.length; i++) {
      AñadirPreguntaExtra(ArrayPreguntas[i], ArrayRespuestas[i])
    }
  }

  document.getElementById("BotonesPreguntas").innerHTML = '<div class="row g-2"><div class="col-md"><button type="button" class="w-100 btn btn-lg btn-outline-secondary" onclick="AñadirPreguntaExtra()">Nueva pregunta</button></div><div class="col-md"><button type="button" class="w-100 btn btn-lg btn-outline-primary" onclick="GuardarPreguntas()">Guardar</button></div></div>';
}

function AñadirPreguntaExtra(pregunta, respuesta) {
  if (pregunta == null) {
    var pregunta = ""
  }
  if (respuesta == null) {
    var respuesta = ""
  }
  const TimeoutAñadirPreguntaExtra = setTimeout(function () { document.getElementById("ListaPreguntas").insertAdjacentHTML('beforeend', '<div class="card mb-4 rounded-3 shadow-sm"> <div class="card-header py-3"> <div class="form-floating mb-3"> <input type="text" class="form-control" name="pregunta[]" placeholder="Pregunta" value="' + pregunta + '"> <label for="floatingInput">Pregunta</label> </div> </div> <div class="card-body"><div class="form-floating mb-3"> <input type="text" class="form-control" name="respuesta[]" placeholder="Respuesta" value="' + respuesta + '"> <label for="floatingInput">Respuesta</label> </div></div> </div>') }, 0);
  //document.getElementById("ListaPreguntas").innerHTML += '<div class="card mb-4 rounded-3 shadow-sm"> <div class="card-header py-3"> <div class="form-floating mb-3"> <input type="text" class="form-control" name="pregunta[]" placeholder="Pregunta" value="' + pregunta + '"> <label for="floatingInput">Pregunta</label> </div> </div> <div class="card-body"><div class="form-floating mb-3"> <input type="text" class="form-control" name="respuesta[]" placeholder="Respuesta" value="' + respuesta + '"> <label for="floatingInput">Respuesta</label> </div></div> </div>';
}

function PrimeraPregunta() {
  document.getElementById("ListaPreguntas").innerHTML = '<div class="card mb-4 rounded-3 shadow-sm"> <div class="card-header py-3"> <div class="form-floating mb-3"> <input type="text" class="form-control" name="pregunta[]" placeholder="Pregunta"> <label for="floatingInput">Pregunta</label> </div> </div> <div class="card-body"><div class="form-floating mb-3"> <input type="text" class="form-control" name="respuesta[]" placeholder="Respuesta"> <label for="floatingInput">Respuesta</label> </div></div> </div>';
}


function GuardarPreguntas() {
  var IDCategoriaSeleccionada = document.getElementById("CategoriaSeleccionada").value
  var NombreCategoriaSeleccionada = JSON.parse(LZString.decompress(localStorage.getItem("Categorias")))[IDCategoriaSeleccionada]

  var Preguntas = document.getElementsByName('pregunta[]');
  var Respuestas = document.getElementsByName('respuesta[]');

  var p = "";
  var r = "";

  for (var i = 0; i < Preguntas.length; i++) {
    var a = Preguntas[i];
    var b = Respuestas[i];
    if (a.value) {
      console.log(a.value)
      p = p + a.value + ';';
      r = r + b.value + ';';
    }
  }

  var ArrayPreguntas = p.slice(0, -1).split(";");
  var ArrayRespuestas = r.slice(0, -1).split(";");

  localStorage.setItem("Preguntas-" + NombreCategoriaSeleccionada, LZString.compress(JSON.stringify(ArrayPreguntas)))
  localStorage.setItem("Respuestas-" + NombreCategoriaSeleccionada, LZString.compress(JSON.stringify(ArrayRespuestas)))


  MenuListaPreguntas()
}



function AñadirCategoriaLocalStorage(NuevaCategoria) {

  if (!localStorage.getItem("Categorias")) {
    var ArrayNuevaCategoria = [NuevaCategoria];
    localStorage.setItem("Categorias", LZString.compress(JSON.stringify(ArrayNuevaCategoria)))
    CrearFormularioCrearPreguntas()
  } else {
    var ArrayCategoriasActuales = JSON.parse(LZString.decompress(localStorage.getItem("Categorias")))
    if (ArrayCategoriasActuales.includes(NuevaCategoria)) {
      AlertaCategoriaExistente()
    } else {
      ArrayCategoriasActuales.push(NuevaCategoria)
      localStorage.setItem("Categorias", LZString.compress(JSON.stringify(ArrayCategoriasActuales)))
      document.getElementById("categoria").value = '';
    }

  }
}

// Exportar LocalStorage a archivo
function DescargarDatos() {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));

  navigator.clipboard.writeText(JSON.stringify(localStorage));
  var dlAnchorElem = document.getElementById('enlaceDescarga');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "AskMatic-export.json");

}

// Importar archivo
function ImportarArchivo() {
  var fileToLoad = document.getElementById("ArchivoAImportar").files[0];

  var fileReader = new FileReader();
  fileReader.onload = function (fileLoadedEvent) {
    var textFromFileLoaded = fileLoadedEvent.target.result;
    var datos = JSON.parse(textFromFileLoaded);
    Object.keys(datos).forEach(function (k) {
      localStorage.setItem(k, datos[k]);
    });

  };

  fileReader.readAsText(fileToLoad, "UTF-8")

}



function ComenzarPreguntas() {
  var categoriaSeleccionada = JSON.parse(LZString.decompress(localStorage.getItem("Categorias")))[document.getElementById("SelectCategoria").value]
  sessionStorage.setItem("Preguntas", LZString.decompress(localStorage.getItem("Preguntas-" + categoriaSeleccionada)))
  sessionStorage.setItem("Respuestas", LZString.decompress(localStorage.getItem("Respuestas-" + categoriaSeleccionada)))
  if (sessionStorage.getItem("Preguntas")) {
    sessionStorage.removeItem("RespuestasDadas")
    SiguientePregunta(0)
  } else {
    AlertaSinPreguntas()
  }
}

function SiguientePregunta(id) {
  PreguntaActual = JSON.parse(sessionStorage.getItem("Preguntas"))[id]
  if (id < [JSON.parse(sessionStorage.getItem("Preguntas")).length - 1]) {
    document.getElementById("formulario").innerHTML = '<div class="card mb-4 rounded-3 shadow-sm"> <div class="card-header py-3"> <div class="form-floating mb-3">' + PreguntaActual + '</div> </div> <div class="card-body"><div class="form-floating mb-3"> <input type="text" class="form-control" id="RespuestaDada" placeholder="Respuesta"> <label for="floatingInput">Respuesta</label> </div></div> </div><button type="button" class="w-100 btn btn-lg btn-outline-primary" onclick="GuardarRespuesta(' + id + ')">Siguiente Pregunta</button>';
  } else {
    document.getElementById("formulario").innerHTML = '<div class="card mb-4 rounded-3 shadow-sm"> <div class="card-header py-3"> <div class="form-floating mb-3">' + PreguntaActual + '</div> </div> <div class="card-body"><div class="form-floating mb-3"> <input type="text" class="form-control" id="RespuestaDada" placeholder="Respuesta"> <label for="floatingInput">Respuesta</label> </div></div> </div><button type="button" class="w-100 btn btn-lg btn-outline-primary" onclick="GuardarRespuesta(' + id + ')">Terminar</button>';
  }

  //Al presionar enter mandamos la nueva categoría a LocalStorage
  document.getElementById("RespuestaDada").addEventListener("keyup", function (event) {
    if (event.code === "Enter") {
      GuardarRespuesta(id)
      return false;
    }
  });

}

function GuardarRespuesta(id) {
  console.log(id)
  if (sessionStorage.getItem("RespuestasDadas")) {
    RespuestasDadas = JSON.parse(sessionStorage.getItem("RespuestasDadas"))
    RespuestasDadas.push(document.getElementById("RespuestaDada").value)
    sessionStorage.setItem("RespuestasDadas", JSON.stringify(RespuestasDadas))
  } else {
    sessionStorage.setItem("RespuestasDadas", "[\"" + document.getElementById("RespuestaDada").value + "\"]")
  }
  if (id < [JSON.parse(sessionStorage.getItem("Preguntas")).length - 1]) {
    SiguientePregunta(id + 1)
  } else {
    window.location.replace("resultados.html"); SiguientePregunta(id + 1)
  }
}

function MostrarResultados() {
  if (sessionStorage.getItem("RespuestasDadas")) {
    var Preguntas = JSON.parse(sessionStorage.getItem("Preguntas"))
    var Respuestas = JSON.parse(sessionStorage.getItem("Respuestas"))
    var RespuestasDadas = JSON.parse(sessionStorage.getItem("RespuestasDadas"))
    for (var i = 0; i < Preguntas.length; i++) {
      if (similarity(Respuestas[i], RespuestasDadas[i]) >= 0.8) {
        document.getElementById("formulario").innerHTML += '<div name="respuesta"> <div class="card mb-4 rounded-3 shadow-sm"> <div class="card-header"> <h3> ' + Preguntas[i] + ' </h3> </div> <ul class="list-group list-group-flush"> <li class="list-group-item text-white bg-success">' + RespuestasDadas[i] + '</li> <li class="list-group-item text-white bg-success">' + Respuestas[i] + '</li> </ul> </div> </div>';

      } else {
        document.getElementById("formulario").innerHTML += '<div name="respuesta"> <div class="card mb-4 rounded-3 shadow-sm"> <div class="card-header"> <h3> ' + Preguntas[i] + ' </h3> </div> <ul class="list-group list-group-flush"> <li class="list-group-item text-white bg-danger">' + RespuestasDadas[i] + '</li> <li class="list-group-item text-white bg-success">' + Respuestas[i] + '</li> </ul> </div> </div>';
      }
    }
  } else {
    window.location.replace("preguntar.html")
  }

}


// Comparar 2 strings y devolver % de similaridad
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}