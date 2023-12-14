const imageSrc = document.getElementById('image'), colorPicker = document.getElementById("color-picker"), 
  errorText = document.getElementById("alertText"), uploadedFile = document.getElementById("file"), uploadLabel = document.querySelector('.upload-image'),
  selectedColorContainer = document.querySelector('.color-res'), colorContainer = document.querySelector('.color-selected-container'), 
  colorPreview = document.getElementById("color-preview"),
  hexadecimalValue = document.getElementById('hexCode'), rgbValue = document.getElementById('rgbCode'), rgbaValue = document.getElementById('rgbaCode')

let eyeDropper;

window.onload = () => {
  colorPreview.style.background = 'white'
  /* Verifica si la API es compatible con el navegador */
  if (!window.EyeDropper) {
      errorText.classList.remove('hidden')
      selectedColorContainer.classList.add('hidden')
      uploadedFile.disabled = true, uploadLabel.style.pointerEvents = 'none', uploadLabel.style.background = '#424649', colorPicker.disabled = true
      errorText.innerText = "Lo sentimos, 'EyeDropper API' no es compatible con este navegador :(";
    return;
  } else { eyeDropper = new EyeDropper() }
};

/* Transforma el color hexadecimal al modelo rgb() y rgba() */
let rgbCodeValue, rgbaCodeValue
const hexColorToRgb = (color, alpha) => {
  const r = parseInt(color.substr(1, 2), 16)
  const g = parseInt(color.substr(3, 2), 16)
  const b = parseInt(color.substr(5, 2), 16)
  rgbCodeValue =  `rgb(${r}, ${g}, ${b})`
  rgbaCodeValue = `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/* Se inicializa la promesa que retornará el código del color */
const initColorPicker = async () => {
  await eyeDropper.open()
    .then((colorValue) => {      
      let hexCode = colorValue.sRGBHex;  
      hexColorToRgb(hexCode, 1)
      hexadecimalValue.value = hexCode, rgbValue.value = rgbCodeValue, rgbaValue.value = rgbaCodeValue
      colorPreview.style.backgroundColor = hexCode
    })
    .catch((error) => { console.error(error) });
};
colorPicker.addEventListener("click", initColorPicker);

/* Se llama al evento 'change' si la imagen es modificada */
uploadedFile.addEventListener('change', () => { 
  let fileReader = new FileReader() //* Objeto que permite leer los archivos del ordenador
  /* Se leé el contenido del archivo y al finalizar se asigna al atributo 'src' de la imagen */
  fileReader.readAsDataURL(uploadedFile.files[0]);
  fileReader.onload = () => {    
    imageSrc.setAttribute("src", fileReader.result);
  };
})

const copyButtons = document.querySelectorAll('.color-res button')
copyButtons.forEach(element => {
  element.addEventListener('click', () => {
    var selectedInput = element.id === 'hex' ? hexadecimalValue : element.id === 'rgb' ? rgbValue : rgbaValue
    selectedInput.select()
    selectedInput.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(selectedInput == hexadecimalValue ? selectedInput.value.toUpperCase() : selectedInput.value)
  })
})