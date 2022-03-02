// Check browser support
if (typeof (Storage) == "undefined") {
  var AlertaIncompatibilidad = new bootstrap.Modal(document.getElementById('BurbujaAlertaIncompatibilidad'))
  AlertaIncompatibilidad.toggle()
}
function AlertaEliminarDatos() {
  var AlertaEliminarDatos = new bootstrap.Modal(document.getElementById('AlertaEliminarDatos'))
  AlertaEliminarDatos.toggle()
}
function EliminarDatos() {
  localStorage.clear()
}