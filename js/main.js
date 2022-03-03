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
  console.log("Error input")
}
function AlertaCategoriaExistente() {
  var AlertaCategoriaExistente = new bootstrap.Modal(document.getElementById('AlertaCategoriaExistente'))
  AlertaCategoriaExistente.toggle()
}

function EliminarDatos() {
  localStorage.clear()
  location.reload();
}

function CrearFormulario() {
  //Si no existe ninguna categoría guardada mostramos un input para añadir una
  if (localStorage.getItem("Categorias") === null) {
    FormularioAñadirCategoria()
  } else {
    MenuCrearPreguntas()
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
  console.log("Añadir categoría")
  var categoria = document.getElementById('categoria').value;
  console.log(categoria)
  if (categoria) {
    AñadirCategoriaLocalStorage(PrimeraLetraMayuscula(categoria))
  } else {
    AlertaInputError()
  }
}

// Crear formulario para añadir categoría
function FormularioAñadirCategoria() {
  document.getElementById("formulario").innerHTML = '<div class="card mb-4 rounded-3 shadow-sm"> <div class="card-header py-3"> <h4 class="my-0 fw-normal">Crea tu primera categoría</h4> </div> <div class="card-body"> <form class="" action="crear.html" method="post"> <input type="text" id="categoria" class="form-control" aria-label="Username" aria-describedby="basic-addon1"><div class="pricing-header p-3 pb-md-4 mx-auto text-center"></div><button type="button" class="w-100 btn btn-lg btn-outline-primary" onclick="MandarCategoria()">Crear</button> </form> </div> </div>';
}

function MenuCrearPreguntas() {
  var MenuParte1 = '<div class="row g-3"> <div class="col-md"> <div class="form-floating"> <input type="text" class="form-control" id="categoria" placeholder="" value="" aria-describedby="button-addon2"> <label for="categoria">Crear nueva categoría</label> </div> </div> <div class="col-md"> <div class="form-floating"> <select class="form-select" id="CategoriaSeleccionada" aria-label="Floating label select">'
  var MenuParte2 = '</select> <label for="CategoriaSeleccionada">Selecciona una categoría</label> </div> </div> </div>'
  var listaCategorias = null


  var ArrayCategorias = JSON.parse(localStorage.getItem("Categorias"))
  console.log(ArrayCategorias)
  ArrayCategorias.forEach(ListarCategorias);

  document.getElementById("formulario").innerHTML = MenuParte1 + listaCategorias + MenuParte2;

  function ListarCategorias(item, index) {
    if (listaCategorias === null){
      listaCategorias = '<option value="'+index+'">'+item+'</option>'
    }else{
      listaCategorias = listaCategorias.concat('<option value="',index,'">',item,'</option>')
    }
  }

  //Al presionar enter mandamos la nueva categoría a LocalStorage
  document.getElementById("categoria").addEventListener("keyup", function (event) {
    if (event.code === "Enter") {
      console.log(event.key)
      MandarCategoria();
      CrearFormulario()
      return false;
    }
  });

}



function AñadirCategoriaLocalStorage(NuevaCategoria) {

  if (!localStorage.getItem("Categorias")) {
    var ArrayNuevaCategoria = [NuevaCategoria];
    localStorage.setItem("Categorias", JSON.stringify(ArrayNuevaCategoria))
    CrearFormulario()
  } else {
    var ArrayCategoriasActuales = JSON.parse(localStorage.getItem("Categorias"))
    if (ArrayCategoriasActuales.includes(NuevaCategoria)) {
      AlertaCategoriaExistente()
    } else {
      ArrayCategoriasActuales.push(NuevaCategoria)
      localStorage.setItem("Categorias", JSON.stringify(ArrayCategoriasActuales))
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
    console.log(datos)
    Object.keys(datos).forEach(function (k) {
      localStorage.setItem(k, datos[k]);
    });

  };

  fileReader.readAsText(fileToLoad, "UTF-8");
}