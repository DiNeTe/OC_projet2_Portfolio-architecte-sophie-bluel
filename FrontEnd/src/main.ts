const userToken = localStorage.getItem("userToken");

type Category = {
  id: number;
  name: string;
};

type Work = {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  imageUrl: string;
  category: Category;
};

let allWorks: Work[] = []; // variable globale pour stocker tous les travaux dans un tableau d'objet

// Fonction pour recupérer la gallerie depuis l'API
async function loadWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    allWorks = await response.json(); // stocke les travaux dans la variable globale
    renderGallery(allWorks); // affiche toute la galerie
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux:", error);
  }
}

// Fonction pour l'affichage de la gallerie
function renderGallery(works: Work[]) {
  const gallery = document.querySelector(".gallery");

  if (!gallery) return;

  gallery.innerHTML = ""; // nettoie la galerie avant d'ajouter de nouveaux travaux

  works.forEach((work) => {
    // parcours chaque œuvre dans le tableau "works"
    const figure = document.createElement("figure"); // crée un nouvel élément "figure" pour chaque œuvre

    // crée le contenu de 'figure'
    figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;

    // Ajoute le nouvel élément 'figure' à l'élément "gallery""
    gallery.appendChild(figure);
  });
}

// Fonction pour récupérer les catégories depuis l'API
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const categories: Category[] = await response.json(); // Converti la réponse en JSON et stock dans 1 tab

    // Vérifie la présence du token avant de créer les boutons filtres
    if (!userToken) {
      createFilterButtons(categories);
      // cache l'icone et le btn "Modifier" pour ouvrir la modale
      let btnSVG = document.getElementById("btnSVG");
      if (btnSVG) {
        btnSVG.style.display = "none";
        if (optionEdit) {
          optionEdit.innerText = "";
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
  }
}

// Fonction pour créer les boutons de filtre
function createFilterButtons(categories: Category[]) {
  const filters = document.querySelector(".filters");
  if (!filters) return;

  // Crée un bouton filtre supplémentaire : 'Tous'
  const allButton = document.createElement("button");
  allButton.innerText = "Tous";
  allButton.classList.add("filter-button");
  allButton.addEventListener("click", function () {
    filterGallery("all");
  });
  filters.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.innerText = category.name;
    button.classList.add("filter-button");
    button.addEventListener("click", function () {
      filterGallery(category);
    });
    filters.appendChild(button);
  });
}

// Fonction pour filtrer la galerie
function filterGallery(category: "all" | Category) {
  if (category === "all") {
    renderGallery(allWorks);
  } else {
    const filteredWorks = allWorks.filter((work) => {
      const isMatch = work.category.name === category.name;
      return isMatch;
    });
    renderGallery(filteredWorks);
  }
}

// Fonction pour changer le texte de login en logout
function logoLogout() {
  const loginLogout = document.querySelector("nav a") as HTMLLIElement | null;
  // verifie si la constante loginLogout est null
  if (!loginLogout) {
    return; // arrette la fonction
  }
  if (userToken) {
    loginLogout.textContent = "logout";
  } else {
    loginLogout.textContent = "login";
  }
}

const optionEdit = document.getElementById("option-edit");

// MODALE

// Sélection des éléments fixe pour la modale
const modalOverlay = document.getElementById(
  "modal-overlay"
) as HTMLDivElement | null;

const modal = document.getElementById("modal") as HTMLDivElement | null;

const titleModal = document.getElementById(
  "title-modal"
) as HTMLDivElement | null;

const closeButton = document.querySelector(
  ".close-button"
) as HTMLSpanElement | null;
closeButton?.addEventListener("click", function () {
  closeModal();
});

const galleryModal = document.getElementById(
  "gallery-modal"
) as HTMLDivElement | null;

const uploadContent = document.getElementById(
  "upload-content"
) as HTMLDivElement | null;

const modalBtnEdit = document.getElementById("btn-edit") as HTMLInputElement;
const modalBar =
  (document.querySelector(".modal-bar") as HTMLDivElement) || null;

const arrowModal = document.getElementById("arrow-modal");
arrowModal?.addEventListener("click", function () {
  arrowReturn();
});

// Fonction pour afficher la barre noire de connexion
function editBar() {
 const editBar = document.querySelector(".edit-bar") as HTMLDivElement;
 const header = document.querySelector("header") as HTMLBodyElement;
 
  if (userToken){
editBar.style.display= "";
header.style.marginTop="75px"
editBar.classList.add("animate");
  }else{
editBar.style.display= "none";
header.style.marginTop="50px"
editBar.classList.remove("animate");
}
}

// Fonction pour ouvrir la modale
function openModal() {
  optionEdit?.addEventListener("click", function () {
    modalOverlay?.classList.add("active");
    modal?.classList.add("active");
    galleryModal?.classList.add("active");
    arrowModal?.classList.remove("active");
    modalBtnEdit.style.background = "#1D6154";
    renderGalleryModal();
    modalBar.style.display = "block";
  });
}

// Fonction pour afficher le contenu "galerie"
function renderGalleryModal() {
  const modalContent = document.createElement("div");
  modalContent.classList.add("gallery-undo");
  modalContent.classList.add("active");
  allWorks.forEach((work) => {
    const workContainer = document.createElement("div");
    workContainer.classList.add("work-container");
    const deleteIcon = document.createElement("div");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = `
      <svg width="9" id="trash-svg" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
      </svg>`;
    // Supression d'une photo de la gallerie
    deleteIcon.addEventListener("click", async function () {
      const confirmWindows = confirm("Confirmer la suppression ?");
      
      if (confirmWindows) {
        console.log("réponse de la fenêtre de confirmation : ", confirmWindows);
       
        try {
          const url = `http://localhost:5678/api/works/${work.id}`; // Utilise les backticks et ${work.id}
          const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${userToken}` },
          });
          if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
          } else {
            // Mise à jour de allWorks pour enlever l'œuvre supprimée
            allWorks = allWorks.filter((workItem) => workItem.id !== work.id);
            // Rechargement de la galerie modale avec les œuvres restantes
            renderGalleryModal();
            loadWorks();
          }
        } catch (error) {
          console.error("Erreur lors de la suppression du travail :", error);
        }
      }
    });

    workContainer.appendChild(deleteIcon);
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    workContainer.appendChild(imgElement);
    modalContent.appendChild(workContainer);
  });

  const modalContainer =
    (document.querySelector(".gallery-modal") as HTMLDivElement) || null;
  modalContainer.innerHTML = "";
  modalContainer.appendChild(modalContent);
  modalBtnEdit.value = "Ajouter une photo";
}

// Fonction pour créer le contenu "Ajout photo"
function renderUploadModal() {
  if (!uploadContent) {
    return;
  }
  uploadContent.innerHTML = "";

  // Crée la div upload-container
  const uploadContainer = document.createElement("div");
  uploadContainer.className = "upload-container";
  uploadContainer.id = "upload-container";
  // Crée les éléments pour la div upload-container
  const img = document.createElement("div");
  img.classList.add("before-preview"); // uploadContent.innerHTML = "";

  img.id = "img-before-preview";
  img.innerHTML = `
  <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M63.5517 15.8879C64.7228 15.8879 65.681 16.8461 65.681 18.0172V60.5768L65.0156 59.7118L46.9165 36.2894C46.3176 35.5042 45.3727 35.0517 44.3879 35.0517C43.4031 35.0517 42.4715 35.5042 41.8594 36.2894L30.8136 50.5824L26.7546 44.8998C26.1557 44.0614 25.1975 43.569 24.1595 43.569C23.1214 43.569 22.1632 44.0614 21.5644 44.9131L10.9178 59.8183L10.319 60.6434V60.6034V18.0172C10.319 16.8461 11.2772 15.8879 12.4483 15.8879H63.5517ZM12.4483 9.5C7.75048 9.5 3.93103 13.3195 3.93103 18.0172V60.6034C3.93103 65.3012 7.75048 69.1207 12.4483 69.1207H63.5517C68.2495 69.1207 72.069 65.3012 72.069 60.6034V18.0172C72.069 13.3195 68.2495 9.5 63.5517 9.5H12.4483ZM23.0948 35.0517C23.9337 35.0517 24.7644 34.8865 25.5394 34.5655C26.3144 34.2444 27.0186 33.7739 27.6118 33.1807C28.2049 32.5876 28.6755 31.8834 28.9965 31.1083C29.3175 30.3333 29.4828 29.5027 29.4828 28.6638C29.4828 27.8249 29.3175 26.9943 28.9965 26.2192C28.6755 25.4442 28.2049 24.74 27.6118 24.1468C27.0186 23.5537 26.3144 23.0831 25.5394 22.7621C24.7644 22.4411 23.9337 22.2759 23.0948 22.2759C22.2559 22.2759 21.4253 22.4411 20.6503 22.7621C19.8752 23.0831 19.171 23.5537 18.5779 24.1468C17.9847 24.74 17.5142 25.4442 17.1931 26.2192C16.8721 26.9943 16.7069 27.8249 16.7069 28.6638C16.7069 29.5027 16.8721 30.3333 17.1931 31.1083C17.5142 31.8834 17.9847 32.5876 18.5779 33.1807C19.171 33.7739 19.8752 34.2444 20.6503 34.5655C21.4253 34.8865 22.2559 35.0517 23.0948 35.0517Z" fill="#B9C5CC"/>
  </svg>`;
  const imgPreview = document.createElement("img");
  imgPreview.id = "img-preview";
  const uploadButton = document.createElement("button");
  uploadButton.className = "before-preview";
  uploadButton.id = "upload-img-btn";
  uploadButton.textContent = "+ Ajouter photo";
  uploadButton.onclick = () =>
    document.getElementById("upload-img-input")?.click();
  const imgInfo = document.createElement("span");
  imgInfo.classList.add("before-preview");
  // imgInfo.className = "img-info";
  imgInfo.id = "img-info";
  imgInfo.innerHTML = "jpg, png : 4mo max";
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.classList.add("user-input");
  inputFile.id = "upload-img-input";
  inputFile.name = "before-preview";
  inputFile.accept = "image/*";
  // Ajoute les nouveaux éléments à la div 'uploadContainer'
  uploadContainer.appendChild(img);
  uploadContainer.appendChild(imgPreview);
  uploadContainer.appendChild(uploadButton);
  uploadContainer.appendChild(inputFile);
  uploadContainer.appendChild(imgInfo);

  // Crée la div upload-form
  const uploadForm = document.createElement("form");
  uploadForm.id = "upload-form";
  // Crée les éléments pour la div upload-form
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.textContent = "Titre";
  const titleInput = document.createElement("input");
  titleInput.className = "user-input";
  titleInput.type = "text";
  titleInput.id = "title";
  titleInput.name = "title";
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "category");
  categoryLabel.textContent = "Catégorie";
  const breakElement = document.createElement("br");
  const categorySelect = document.createElement("select");
  categorySelect.className = "user-input";
  categorySelect.id = "category";
  categorySelect.name = "category";
  const categorySelectEmpty = document.createElement("option");
  categorySelectEmpty.value = "";
  categorySelect.appendChild(categorySelectEmpty);
  // Ajoute les nouveaux éléments à la div 'upload-form'
  uploadForm.appendChild(titleLabel);
  uploadForm.appendChild(titleInput);
  uploadForm.appendChild(categoryLabel);
  uploadForm.appendChild(breakElement);
  uploadForm.appendChild(categorySelect);

  // Ajoute "optionEdit" & "uploadForm" à la div "upload-content"
  uploadContent.appendChild(uploadContainer);
  uploadContent.appendChild(uploadForm);
}

// Fonction pour ouvrir le contenu "Ajout photo" dans la modale
function addPhotoModal() {
  modalBtnEdit?.addEventListener("click", function () {
    galleryModal?.classList.remove("active");
    arrowModal?.classList.add("active");
    uploadContent?.classList.add("active");
    galleryModal!.innerHTML = "";
    titleModal!.textContent = "Ajout Photo";
    modalBtnEdit.value = "Valider";
    modalBtnEdit.style.background = "#A7A7A7";
    renderUploadModal();
    categorySelect();
    imagePreview();
    userInputsFill();
  });
}

// fonction pour remplir le select "catégorie"
function categorySelect() {
  const category = document.getElementById("category") as HTMLSelectElement;
  // Constante pour suivre les categories et eviter les doublons
  const addedCategories: { [key: number]: boolean } = {};

  allWorks.forEach((work) => {
    // vérifie si l'ID de la catégorie n'a pas déjà été ajouté à l'élément select
    if (!addedCategories[work.category.id]) {
      const option = new Option(
        work.category.name,
        work.category.id.toString()
      );
      category.add(option);
      addedCategories[work.category.id] = true;
    }
  });
}

// Fonction pour génerer la preview de l'oeuvre à ajouter
function imagePreview() {
  const inputElement = document.getElementById(
    "upload-img-input"
  ) as HTMLInputElement;
  const imgPreview = document.getElementById("img-preview") as HTMLImageElement;

  inputElement?.addEventListener("change", function (event) {
    console.log("image chargée");

    const beforePreview = document.querySelectorAll(".before-preview");
    beforePreview.forEach((element) => {
      element.classList.add("hidden");
    });

    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];

    if (file) {
      const imgURL = URL.createObjectURL(file);
      imgPreview.src = imgURL;
    }
  });
}

function imgPreviewHidden() {
  const imgBeforePreview = document.getElementById("img-before-preview");
  const uploadImgInput = document.getElementById("upload-img-input");
  const imgInfo = document.getElementById("img-info");
  imgBeforePreview?.classList.add("hidden");
  uploadImgInput?.classList.add("hidden");
  imgInfo?.classList.add("hidden");
}

// // Fonction pour dégriser le bouton valider lorsque tous les champs sont remplis
function userInputsFill() {
  const inputFile = document.getElementById(
    "upload-img-input"
  ) as HTMLInputElement;
  const titleInput = document.getElementById("title") as HTMLInputElement;
  const category = document.getElementById("category") as HTMLSelectElement;

  const checkInputs = () => {
    let inputsFilled =
      inputFile.files!.length > 0 && titleInput.value && category.value;
    modalBtnEdit.style.background = inputsFilled ? "#1D6154" : "#A7A7A7";
  };

  inputFile.addEventListener("change", checkInputs);
  titleInput.addEventListener("input", checkInputs);
  category.addEventListener("change", checkInputs);
}

// fonction pour le fonctionnement de la flêche retour dans la modale
function arrowReturn() {
  galleryModal?.classList.add("active");
  titleModal!.textContent = "Galerie photo";
  modalBtnEdit.value = "Ajouter photo";
  uploadContent?.classList.remove("active");
  modalBtnEdit.style.background = "#1D6154";
  if (!uploadContent) {
    return;
  }
  uploadContent.innerHTML = "";
  arrowModal?.classList.remove("active");
  renderGalleryModal();
}

// Fonction pour fermer la modale
function closeModal() {
  modal?.classList.remove("active");
  modalOverlay?.classList.remove("active");
  galleryModal?.classList.remove("active");
  titleModal!.textContent = "Galerie photo";
  modalBtnEdit.value = "Valider";
  uploadContent?.classList.remove("active");
  arrowModal?.classList.remove("active");
  if (!uploadContent) {
    return;
  }
  uploadContent.innerHTML = "";
}

window.onclick = function(event) {
  if (event.target === modalOverlay) {
    closeModal();
  }
}

// Action du bouton "valider" dans le formulaire "Ajout photo"
modalBtnEdit.addEventListener("click", async function (event) {
  event.preventDefault();
  // if-1 = Vérifie si il s'agit bien du bouton "Valider"
  if (
    !galleryModal?.classList.contains("active") &&
    uploadContent?.classList.contains("active")
  ) {
    // Si if-1 OK, crée des constantes pour sélectionner les élèments du formulaire
    const titleElement = document.getElementById("title") as HTMLInputElement;
    const categoryElement = document.getElementById(
      "category"
    ) as HTMLSelectElement;
    const imgElement = document.getElementById(
      "upload-img-input"
    ) as HTMLInputElement;

    const titleContent = titleElement.value;
    const categoryContent = categoryElement.value;
    const file = imgElement.files?.[0];

    // if-1.1 = vérifie si les entrées du formulaire sont remplies
    if (titleContent && categoryContent && file) {
      const formData = new FormData();

      // si if-1.1 OK, crée le formData
      formData.append("title", titleContent);
      formData.append("image", file);
      formData.append("category", categoryContent);

      // Envoi de la requête API
      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "Post",
          headers: { Authorization: `Bearer ${userToken}` },
          body: formData,
        });

        // if-1.2 = vérifie la réponse de l'API
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        } else {
          closeModal();
          loadWorks();
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi des données :", error);
      }
    }
    // if-1.1 (si toutes les entrées du formulaire ne sont pas toutes remplies)
    else {
      alert("Veuillez remplir tous les champs avant d'ajouter une photo");
    }
  }
}); // FIN MODALE

// verifie le userToken aprés un rechargement de la page et execute ces fonctions
document.addEventListener("DOMContentLoaded", function () {
  if (userToken) {
    console.log("Token:", userToken);
  } else {
    console.log("Aucun token trouvé");
  }
  loadWorks();
  getCategories();
  logoLogout();
  openModal();
  arrowReturn();
  addPhotoModal();
  closeModal();
  editBar();
});