const dogsList = document.getElementById('dogList');
const dogPicture = document.getElementById('dogPicture');
const dogName = document.getElementById('dogName');
const fontList = document.getElementById('fontList');
const colorList = document.getElementById('colorList');
const buttonDelete = document.getElementById('buttonDelete');
const formDog = document.getElementById('formDog');
const dogText = document.getElementById('dogText');
const dogLabel = document.getElementById('dogLabel');

//
// Helpers
//
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

function notifyUser(message, cssClass) {
  const messageContainer = document.querySelector('.alert');
  messageContainer.classList.add(cssClass);
  messageContainer.innerHTML = message;
  messageContainer.style.display = 'block';
  setTimeout(() => {
    messageContainer.innerHTML = '';
    messageContainer.style.display = 'none';
  }, 4000);
}

function showDate(dateStorage) {
  const dayName = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const monName = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'agosto', 'outubro', 'novembro', 'dezembro'];

  const dateString = `${dayName[dateStorage.getDay()]}, ${
    dateStorage.getDate()} de ${monName[dateStorage.getMonth()]} de ${
    dateStorage.getFullYear()} às ${dateStorage.getHours()}:${dateStorage.getMinutes()
  }:${dateStorage.getSeconds()}.`;
  return (dateString);
}

function createSelectOptions(data) {
  let output = '';
  Object.keys(data).forEach((key) => { output += `<option value="${key}">${key}</option>`; });
  document.getElementById('dogList').innerHTML = output;
}

function getImageURL(data) {
  const randomPosition = data[Math.floor(Math.random() * data.length) + 1];
  dogPicture.src = randomPosition;
}

function getBreedList() {
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(checkStatus)
    .then((response) => response.json())
    .then((data) => createSelectOptions(data.message))
    .catch((error) => notifyUser(`Houston, temos um problema na requisição da API: (${error})!`, 'alert-danger'));
}

//
// Change
//
function getBreedImages() {
  const selectedBreed = dogsList.options[dogsList.selectedIndex].value;
  fetch(`https://dog.ceo/api/breed/${selectedBreed}/images`)
    .then(checkStatus)
    .then((response) => response.json())
    .then((data) => getImageURL(data.message))
    .catch((error) => notifyUser(`Houston, temos um problema nas imagens: (${error})!`, 'alert-danger'));
}

function changeName() {
  const insertedName = dogName.value;
  dogText.innerText = insertedName;
}

function changeFont() {
  const selectedFont = fontList.options[fontList.selectedIndex].value;
  dogText.style.fontFamily = selectedFont;
  dogLabel.style.fontFamily = selectedFont;
}

function changeColor() {
  const selectedColor = colorList.options[colorList.selectedIndex].value;
  dogText.style.color = selectedColor;
  dogLabel.style.color = selectedColor;
}

//
// Storage
//
function saveForm(evt) {
  evt.preventDefault();
  const selectedBreed = dogsList.options[dogsList.selectedIndex].value;
  const randomImage = dogPicture.src;
  const insertedName = dogName.value;
  const selectedFont = fontList.options[fontList.selectedIndex].value;
  const selectedColor = colorList.options[colorList.selectedIndex].value;
  const dateSave = new Date();

  const dog = {
    breed: selectedBreed,
    picture: randomImage,
    name: insertedName,
    font: selectedFont,
    color: selectedColor,
    date: dateSave,
  };

  if (typeof (Storage) !== 'undefined') {
    localStorage.setItem('mybestfriend', JSON.stringify(dog));
    notifyUser('Dados salvos com sucesso! :)', 'alert-success');
  } else {
    notifyUser('Desculpe, seu navegador não suporta Web Storage! :(', 'alert-danger');
  }
}

function retrieveForm() {
  if (typeof (Storage) !== 'undefined') {
    const retrievedObject = localStorage.getItem('mybestfriend');
    const parsedObject = JSON.parse(retrievedObject);
    const selectedBreed = parsedObject.breed;
    const randomImage = parsedObject.picture;
    const insertedName = parsedObject.name;
    const selectedFont = parsedObject.font;
    const selectedColor = parsedObject.color;
    const dateSave = parsedObject.date;

    setTimeout(() => {
      dogsList.value = selectedBreed;
    }, 100);

    dogPicture.src = randomImage;

    dogName.value = insertedName;
    dogText.innerText = insertedName;

    fontList.value = selectedFont;
    dogText.style.fontFamily = selectedFont;
    dogLabel.style.fontFamily = selectedFont;

    colorList.value = selectedColor;
    dogText.style.color = selectedColor;
    dogLabel.style.color = selectedColor;

    const newdateSave = new Date(dateSave);
    document.getElementById('dateSave').innerText = showDate(newdateSave);
  } else {
    notifyUser('Desculpe, seu navegador não suporta Web Storage! :(', 'alert-danger');
  }
}

function deleteStorage() {
  try {
    window.localStorage.removeItem('mybestfriend');
    window.scrollTo(0, 0);
    formDog.reset();
    notifyUser('Dados excluídos com sucesso! :)', 'alert-success');
  } catch (e) {
    notifyUser(`Erro ao exluir os dados: (${e})!`, 'alert-danger');
  }
}

//
// Show
//
window.addEventListener('load', getBreedList);

//
// Change
//
dogsList.addEventListener('change', getBreedImages);
dogName.addEventListener('input', changeName);
fontList.addEventListener('change', changeFont);
colorList.addEventListener('change', changeColor);

//
// Storage
//
window.addEventListener('load', retrieveForm);
formDog.addEventListener('submit', saveForm);
buttonDelete.addEventListener('click', deleteStorage);
