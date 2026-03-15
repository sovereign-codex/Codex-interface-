function val(id){
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}
function setOut(id, text){
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
