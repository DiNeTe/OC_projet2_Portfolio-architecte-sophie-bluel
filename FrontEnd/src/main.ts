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

function getMaxWorkId(works: any[]) {
  return works.reduce(
    (maxId: number, work: { id: number }) => Math.max(maxId, work.id),
    0
  );
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

// Fonction pour afficher le contenu "galerie"
function renderGalleryModal() {
  const modalContent = document.createElement("div");
  modalContent.classList.add("gallery-undo");
  allWorks.forEach((work) => {
    const workContainer = document.createElement("div");
    workContainer.classList.add("work-container");

    const deleteIcon = document.createElement("div");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = `
      <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
      </svg>`;
    deleteIcon.addEventListener("click", function () {
      // logique pour supprimer le travail
      console.log("Suppression du travail:", work.id);
      // deleteWork(work.id); //
    });

    deleteIcon.classList.add("delete-icon");
    deleteIcon.addEventListener("click", function () {
      // requete API
      // deleteWork(work.id); //
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

// selectionne la Div upload-content
const uploadContentDiv = document.getElementById(
  "upload-content"
) as HTMLDivElement;

// Fonction pour afficher le contenu "Ajout photo"
function renderUploadModal() {
  uploadContentDiv.innerHTML = "";

  // Crée la div img-preview
  const imgPreview = document.createElement("div");
  imgPreview.className = "img-preview";
  imgPreview.id = "img-preview";
  // Crée les éléments pour la div upload-img
  const imgPreviewLoaded = document.createElement("img");
  imgPreviewLoaded.id = "img-preview-loaded";
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
  const uploadForm = document.createElement("form");
  uploadForm.id = "upload-form";
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
  uploadForm.appendChild(titleLabel);
  uploadForm.appendChild(titleInput);
  uploadForm.appendChild(categoryLabel);
  uploadForm.appendChild(breakElement);
  uploadForm.appendChild(categorySelect);

  // Ajoute les nouveaux éléments à la div 'upload-content'
  uploadContentDiv.appendChild(imgPreview);
  uploadContentDiv.appendChild(uploadImgDiv);
  uploadContentDiv.appendChild(uploadForm);
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
  modalBtnEdit?.addEventListener("click", function () {
    galleryModal?.classList.remove("active");
    arrowModal?.classList.add("active");
    uploadContent?.classList.add("active");
    galleryModal!.innerHTML = "";
    titleModal!.textContent = "Ajout Photo";
    modalBtnEdit.value = "Valider";
    renderUploadModal();
    categorySelect();
    imagePreview();
  });
}

function imagePreview() {
  const inputElement = document.getElementById(
    "upload-img-input"
  ) as HTMLInputElement;
  const imgPreview = document.getElementById(
    "img-preview-loaded"
  ) as HTMLImageElement;

  inputElement?.addEventListener("change", function (event) {
    console.log("image chargée");

    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];

    if (file) {
      const imgURL = URL.createObjectURL(file);
      imgPreview.src = imgURL;
    }
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

// fonction pour le fonctionnement de la flêche retour dans la modale
function arrowReturn() {
  let arrow = document.getElementById("arrow-modal");
  arrow?.addEventListener("click", function () {
    console.log("click arrow");
    galleryModal?.classList.add("active");
    modalContent?.classList.remove("active");
    titleModal!.textContent = "Galerie photo";
    modalBtnEdit.value = "Ajouter photo";
    uploadContentDiv?.classList.remove("active");
    uploadContentDiv.innerHTML = "";
    arrowModal?.classList.remove("active");
    renderGalleryModal();
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
    uploadContentDiv?.classList.remove("active");
    uploadContentDiv.innerHTML = "";
  });
}

// // Test bouton "Ajouter une photo / Valider"
// modalBtnEdit?.addEventListener("click", function () {
//   if (
//     galleryModal?.classList.contains("active") &&
//     !uploadContent?.classList.contains("active")
//   ) {
//     console.log('click btn "ajouter une photo" ok');
//   } else {
//     console.log('click btn "Valider" ok');
//   }
// });

// Action du bouton "valider" dans le formulaire "Ajout photo"
modalBtnEdit?.addEventListener("click", async function () {
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

    // verifie les entrées du formulaire par des console.log
    console.log(
      !titleElement.value ? "titre : aucun" : "titre : ",
      titleElement.value
    );
    console.log("N° de catégorie : ", categoryElement.value);
    console.log(
      !imgElement.files?.[0] ? "Image : aucune image selectionnée" : "Image : ",
      imgElement.files?.[0]
    );
    console.log("User Token : ", userToken);

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

        console.log('click btn "valider" ok');

        // if-1.3 = vérifie la réponse de l'API
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // const result = await response.json();
        // console.log(result);
      } catch (error) {
        console.error("Erreur lors de l'envoi des données :", error);
      }
    }
    // if-1.1 (si toutes les entrées du formulaire ne sont pas remplies)
    else {
      alert("Veuillez remplir tous les champs avant d'ajouter une photo");
    }
  }
});
// Fin Modale

// reset userToken aprés logout
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
  arrowReturn();
  addPhotoModal();
});
