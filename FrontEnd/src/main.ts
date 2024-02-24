// CSS importé depuis le HTML pour eviter effet de rechargement index/login

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

let allWorks: Work[] = []; // Variable globale pour stocker tous les travaux

async function loadWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    allWorks = await response.json(); // Stocke les travaux dans la variable globale
    renderGallery(allWorks); // Affiche toute la galerie
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux:", error);
  }
}

function renderGallery(works: Work[]) {
  const gallery = document.querySelector(".gallery");

  if (!gallery) return;

  gallery.innerHTML = ""; // Nettoie la galerie avant d'ajouter de nouveaux travaux

  works.forEach((work) => {
    const figure = document.createElement("figure");

    figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;

    gallery.appendChild(figure);
  });
}

// Fonction pour récupérer les catégories depuis l'API
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const categories: Category[] = await response.json(); // Converti la réponse en JSON

    // Vérifie la présence du token avant de créer les boutons filtres
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      createFilterButtons(categories);

      let btnSVG = document.getElementById("btnSVG");
      if (btnSVG) {
        btnSVG.style.display = "none";
        let optionEdit = document.getElementById("option-edit");
        if (optionEdit) {
          optionEdit.innerText = "";
        }
      }
    }
  } catch (error) {
    console.error("There has been a problem with fetch operation:", error);
  }
}

// Fonction pour créer les boutons de filtre
function createFilterButtons(categories: Category[]) {
  const filters = document.querySelector(".filters");

  if (!filters) return;

  // filters.innerHTML = '';

  // Crée un bouton filtre 'Tous'
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
      console.log(
        `Comparaison : ${work.category.name} === ${category.name}`,
        isMatch
      );
      return isMatch;
    });
    renderGallery(filteredWorks);
  }
}

const userToken = localStorage.getItem("userToken");

// Fonction pour changer le texte de login en logout
function logoLogout() {
  const loginLogout = document.querySelector("nav a") as HTMLLIElement | null;
  // verifie si la constante loginLogout est null (evite erreur loginLogout.textContent)
  if (!loginLogout) {
    console.log("Lien de connexion/déconnexion non trouvé");
    return; // arrette la fonction
  }
  if (userToken) {
    loginLogout.textContent = "logout";
  } else {
    loginLogout.textContent = "login";
  }
}

// MODALE

// Fonction pour afficher le contenu "galerie" dans la modale
function renderGalleryModal() {
  const modalContent = document.createElement("div");
  allWorks.forEach((work) => {
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    modalContent.appendChild(imgElement);
  });
  const modalContainer =
    document.querySelector<HTMLDivElement>(".gallery-modal");
  modalContainer!.innerHTML = "";
  modalContainer?.appendChild(modalContent);
  modalBtnEdit.value = "Ajouter une photo";
}

// selectionne la Div upload-content
const uploadContentDiv = document.getElementById(
  "upload-content"
) as HTMLDivElement;

// Fonction pour afficher le contenu "Ajout photo" dans la modale
function renderUploadModal() {
  uploadContentDiv.innerHTML = "";

  // Crée la div img-preview
  const imgPreview = document.createElement("div");
  imgPreview.className = "img-preview";
  imgPreview.id = "img-preview";
  // Crée les éléments pour la div upload-img
  const imgPreviewLoaded = document.createElement("img");
  // Ajoute les nouveaux éléments à la div 'uploadImgDiv'
  imgPreview.appendChild(imgPreviewLoaded);

  // Crée la div upload-img
  const uploadImgDiv = document.createElement("div");
  uploadImgDiv.className = "upload-img";
  uploadImgDiv.id = "upload-img";
  // Crée les éléments pour la div upload-img
  const img = document.createElement("img"); // mettre SVG
  const uploadButton = document.createElement("button");
  uploadButton.className = "upload-img-btn";
  uploadButton.textContent = "+ Ajouter photo";
  uploadButton.onclick = () =>
    document.getElementById("upload-img-input")?.click();
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.id = "upload-img-input";
  inputFile.name = "upload-img-input";
  inputFile.accept = "image/*";
  // Ajoute les nouveaux éléments à la div 'uploadImgDiv'
  uploadImgDiv.appendChild(img);
  uploadImgDiv.appendChild(uploadButton);
  uploadImgDiv.appendChild(inputFile);

  // Crée la div upload-form
  const uploadFormDiv = document.createElement("div");
  uploadFormDiv.id = "upload-form";
  // Crée les éléments pour la div upload-form
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.textContent = "Titre";
  const titleInput = document.createElement("input");
  titleInput.className = "upload-form";
  titleInput.type = "text";
  titleInput.id = "title";
  titleInput.name = "title";
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "category");
  categoryLabel.textContent = "Catégorie";
  const breakElement = document.createElement("br");
  const categorySelect = document.createElement("select");
  categorySelect.className = "upload-form";
  categorySelect.id = "category";
  categorySelect.name = "category";
  // Ajoute les nouveaux éléments à la div 'upload-form'
  uploadFormDiv.appendChild(titleLabel);
  uploadFormDiv.appendChild(titleInput);
  uploadFormDiv.appendChild(categoryLabel);
  uploadFormDiv.appendChild(breakElement);
  uploadFormDiv.appendChild(categorySelect);

  // Ajoute les nouveaux éléments à la div 'upload-content'
  uploadContentDiv.appendChild(imgPreview);
  uploadContentDiv.appendChild(uploadImgDiv);
  uploadContentDiv.appendChild(uploadFormDiv);
}

// Sélection des éléments fixe pour la modale

const arrowModal = document.getElementById("arrow-modal");

const titleModal = document.getElementById(
  "title-modal"
) as HTMLDivElement | null;

const closeButton = document.querySelector(
  ".close-button"
) as HTMLSpanElement | null;

const modalOverlay = document.getElementById(
  "modal-overlay"
) as HTMLDivElement | null;

const modal = document.getElementById("modal") as HTMLDivElement | null;

const modalContent = document.getElementById(
  "modal-content"
) as HTMLDivElement | null;

const galleryModal = document.getElementById(
  "gallery-modal"
) as HTMLDivElement | null;

const uploadContent = document.getElementById(
  "upload-content"
) as HTMLDivElement | null;

const modalBtnEdit = document.getElementById("btn-edit") as HTMLInputElement;

// Fonction pour ouvrir le contenu "Galerie" dans la modale
function openModal() {
  let optionEdit = document.getElementById("option-edit");
  optionEdit?.addEventListener("click", function () {
    modalOverlay?.classList.add("active");
    modal?.classList.add("active");
    galleryModal?.classList.add("active");
    arrowModal?.classList.remove("active");

    renderGalleryModal();
  });
}

// Fonction pour ouvrir le contenu "Ajout photo" dans la modale
function addPhotoModal() {
  let addPhoto = document.getElementById("btn-edit");
  addPhoto?.addEventListener("click", function () {
    console.log("click ajout photo ok");
    galleryModal?.classList.remove("active");
    arrowModal?.classList.add("active");
    uploadContent?.classList.add("active");
    galleryModal!.innerHTML = "";
    titleModal!.textContent = "Ajout Photo";
    modalBtnEdit.value = "Valider";
    renderUploadModal();
    categorySelect();
  });
}

// fonction pour remplir le select "catégorie"
function categorySelect() {
  const category = document.getElementById("category") as HTMLSelectElement;
  // Constante pour suivre les categories et eviter les doublons
  const addedCategories: { [key: number]: boolean } = {};

  allWorks.forEach((work) => {
    // vérifie si l'ID de la catégorie n'a pas encore été ajouté à l'élément select
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

// Fonction pour fermer la modale
function closeModal() {
  let closeBtn = document.querySelector(".close-button");
  closeBtn?.addEventListener("click", function () {
    modal?.classList.remove("active");
    modalOverlay?.classList.remove("active");
    galleryModal?.classList.remove("active");
    modalContent?.classList.remove("active");
    titleModal!.textContent = "Galerie photo";
    modalBtnEdit.value = "Valider";
    uploadContentDiv.innerHTML = "";
  });
}

// function arrowReturn() {
//   let arrow = document.getElementById("arrow.modal");
//   arrow?.addEventListener("click"),fuction() {
//     openModal();
//   }
// }

// Envoi d’un nouveau projet au back-end via le formulaire de la modale

// async function sendFormData() {
//   const titleElement = document.getElementById("title");

//   if (!titleElement) {
//     console.log("L'élément 'title' est introuvable.");
//     return;
//   }

//   const titleValue = (titleElement as HTMLInputElement).value;

//   if (!titleValue) {
//     console.log("Veuillez remplir tous les champs");
//     return;
//   }

//   try {
//     const response = await fetch('http://localhost:5678/api/works', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         "title": titleValue,
//       })
//     });

//     if (!response.ok) {
//       throw new Error("Erreur réponse API works");
//     } } catch (error) {
//       console.error(error);
//     }  }

// Fin Modale

// Fonction pour reset userToken aprés logout
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
  closeModal();
  addPhotoModal();
});
