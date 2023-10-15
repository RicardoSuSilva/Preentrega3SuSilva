const prodForm = document.querySelector(".prod-form");
const prodInput = document.querySelector("input");
const submitBtn = document.querySelector(".submit-btn");
const prodContainer = document.querySelector(".prod-container");
const prodList = document.querySelector(".prod-list");
const alertMessage = document.querySelector(".alert");
const listClearBtn = document.querySelector(".clear-btn");
const localStorage = window.localStorage;
let editElement;
let editflag = false;

// mantener productos actualizados
window.addEventListener("DOMContentLoaded", setupItems);

// adiciona productos a la lista
prodForm.addEventListener("submit", addItem);

// borra los productos de la lista
listClearBtn.addEventListener("click", clearList);

// borra o edita productos de la lista
prodList.addEventListener("click", updateList);

// *****************************
function createItem(id, title) {
  const article = document.createElement("article");

  const attribute = document.createAttribute("data-id");
  attribute.value = id;
  article.setAttributeNode(attribute);

  article.classList.add("prod-item");

  article.innerHTML = `<p class="title">${title}</p>
    <div class="btn-container">
      <button class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;

  prodList.append(article);
}

function showAlert(text, action) {
  alertMessage.textContent = text;
  alertMessage.classList.add(`alert-${action}`);

  setTimeout(() => {
    alertMessage.textContent = "";
    alertMessage.classList.remove(`alert-${action}`);
  }, 1500);
}

function addItem(e) {
  e.preventDefault();
  const prodInputValue = prodInput.value;

  if (editflag && prodInputValue) {
    const editedValue = prodInput.value;
    editElement.children[0].innerHTML = editedValue;

    let itemId = editElement.dataset.id;
    updateLocalStorage(itemId, editedValue);

    submitBtn.innerHTML = "Añadir";
    setBackToDefault();

    showAlert("Lista actualizada", "success");
    return;
  }

  if (!prodInputValue) {
    showAlert("Ingrese productos", "danger");
    return;
  } else {
    showAlert("Cargando a la lista", "success");
  }

  prodContainer.classList.add("show-container");

  const id = new Date().getTime().toString();
  createItem(id, prodInputValue);

  addItemToLocalStorage(id, prodInputValue);

  setBackToDefault();
}

function clearList() {
  prodList.innerHTML = "";

  prodContainer.classList.remove("show-container");

  localStorage.removeItem("list");
  showAlert("Lista vacia", "danger");
}

function updateList(e) {
  if (e.target.parentElement.tagName == "BUTTON") {
    const currentBtn = e.target.parentElement;
    const currentItem = currentBtn.parentElement.parentElement;

    if (currentBtn.classList.contains("delete-btn")) {
      let id = currentItem.dataset.id;
      removeFromLocalStorage(id);

      prodList.removeChild(currentItem);

      if (prodList.children.length == 0) {
        prodContainer.classList.remove("show-container");
      }

      setBackToDefault();
      showAlert("producto borrado", "danger");
    }

    if (currentBtn.classList.contains("edit-btn")) {
      let currentValue = currentItem.childNodes[0].textContent;

      prodInput.value = currentValue;

      submitBtn.innerHTML = "editar";

      editElement = currentItem;
      editflag = true;
    }
  }
}

function setBackToDefault() {
  prodInput.value = "";
  editflag = false;
  submitBtn.innerHTML = "submit";
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("list")) ?? [];
}

function addItemToLocalStorage(id, value) {
  let obj = { id, value };

  let list = getLocalStorage();

  list.push(obj);

  localStorage.setItem("list", JSON.stringify(list));
}

function removeFromLocalStorage(id) {
  let list = getLocalStorage();

  let updatedList = list.filter(function removeItem(item) {
    return item.id != id;
  });

  localStorage.setItem("list", JSON.stringify(updatedList));
}

function updateLocalStorage(id, value) {
  let list = getLocalStorage();

  let updatedList = list.map(function updateItem(item) {
    if (item.id == id) {
      item.value = value;
    }

    return item;
  });

  localStorage.setItem("list", JSON.stringify(updatedList));
}

function setupItems() {
  let list = getLocalStorage();

  if (list.length > 0) {
    prodContainer.classList.add("show-container");
    list.forEach((item) => {
      createItem(item.id, item.value);
    });
  }
}