const uploadImageForm = document.querySelector('.upload-image-form'), uploadedImage = document.getElementById('uploaded-image'),
  imageSrc = document.getElementById('image'), colorPickerButton = document.getElementById("color-picker"), errorText = document.getElementById("alertText"), 
  colorContainer = document.querySelector('.color-selected-container'), colorPreview = document.getElementById("color-preview"),
  hexValue = document.getElementById('hexCode'), rgbValue = document.getElementById('rgbCode'), rgbaValue = document.getElementById('rgbaCode')
let eyeDropper

window.onload = () => {
  colorPreview.style.background = 'white'
  /* Verifica si la API es compatible con el navegador o no */
  if (!window.EyeDropper) {
      errorText.classList.remove('hidden')
      colorContainer.classList.add('hidden')
      colorPickerButton.disabled = true, uploadedImage.disabled = true
      errorText.innerText = `\u{f071} EyeDropper API no es compatible con este navegador \u{f071}`
    return
  } else { eyeDropper = new EyeDropper() }
};

/* Transforma el color hexadecimal al modelo rgb() y rgba() */
let rgbCodeValue, rgbaCodeValue
const hexColorToRgb = (color, alpha) => {
  const r = parseInt(color.substr(1, 2), 16)
  const g = parseInt(color.substr(3, 2), 16)
  const b = parseInt(color.substr(5, 2), 16)
  rgbCodeValue =  `rgb(${r}, ${g}, ${b});`, rgbaCodeValue = `rgba(${r}, ${g}, ${b}, ${alpha});`
}

/* Se inicializa la promesa que retornará el código del color */
const initColorPicker = async () => {
  await eyeDropper.open()
    .then((colorValue) => {      
      let hexCode = colorValue.sRGBHex
      hexColorToRgb(hexCode, 1)
      hexValue.value = hexCode, rgbValue.value = rgbCodeValue, rgbaValue.value = rgbaCodeValue
      colorPreview.style.backgroundColor = hexCode
    })
    .catch((error) => { console.error(error) });
};
colorPickerButton.addEventListener("click", initColorPicker);

/* Se llama al evento 'change' si la imagen es modificada y al evento 'click' del formulario  */
uploadImageForm.addEventListener('click', () => { uploadedImage.click() })
uploadedImage.addEventListener('change', () => { 
  let fileReader = new FileReader() //* Objeto que permite leer los archivos del ordenador
  /* Se leé el contenido del archivo y al finalizar se asigna al atributo 'src' de la imagen */
  fileReader.readAsDataURL(uploadedImage.files[0])
  fileReader.onload = () => {    
    imageSrc.setAttribute("src", fileReader.result)
  };
})

/* Copia el valor del input dependiendo el botón que se seleccionó */
const copyButtons = document.querySelectorAll('.color-selected-container button')
copyButtons.forEach(element => {
  element.addEventListener('click', () => {
    var selectedInput = element.id === 'hex' ? hexValue : element.id === 'rgb' ? rgbValue : rgbaValue
    selectedInput.select()
    selectedInput.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(selectedInput == hexValue ? selectedInput.value.toUpperCase() : selectedInput.value)
  })
})