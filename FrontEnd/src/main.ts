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
    console.error("There has been a problem with your fetch operation:", error);
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
  const loginLogout = document.querySelector("nav a");
  // verifie si la constante loginLogout est null (evite erreur loginLogout.textContent)
  if (!loginLogout) {
    console.log("Lien de connexion/déconnexion non trouvé");
    return;
  }

  if (userToken) {
    loginLogout.textContent = "logout";
  } else {
    loginLogout.textContent = "login";
  }
}

// Sélection des éléments pour la modale
const modal = document.getElementById("modal");
const modalOverlay = document.getElementById("modal-overlay");
const closeButton = document.querySelector(".close-button");

// Fonction pour ouvrir la modale
function openModal() {
  let optionEdit = document.getElementById("option-edit");
  optionEdit?.addEventListener("click", function () {
    modal?.classList.add("active");
    modalOverlay?.classList.add("active");
    renderGalleryModal();
  });
}

// Fonction pour fermer la modale
function closeModal() {
  let closeBtn = document.querySelector(".close-button");
  closeBtn?.addEventListener("click", function () {
    modal?.classList.remove("active");
    modalOverlay?.classList.remove("active");
  });
}

// Fonction pour voir les travaux actuels dans la modale
function renderGalleryModal() {
  const modalContent = document.createElement("div");

  allWorks.forEach((work) => {
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    modalContent.appendChild(imgElement);
  });

  const galleryModal = document.getElementById("gallery-modal");
  if (galleryModal) {
    galleryModal.innerHTML = "";
    galleryModal.appendChild(modalContent);
  }
}

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
  // }
});

const btnModif = document.getElementById("btn-modif");
btnModif?.addEventListener("click", function () {
  ;
})

//  check si le token est dans le local storage
// function checkTokenPresence() {
//   setInterval(() => {
//     const userToken = localStorage.getItem("userToken");
//     if (userToken) {
//       console.log("Token présent:", userToken);
//     } else {
//       console.log("Token absent");
//     }
//   }, 5000); // Vérifie toutes les 5 secondes
// }

// checkTokenPresence();

// appel à la fonction loadWorks et initialisation
// loadWorks();
