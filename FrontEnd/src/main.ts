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
    createFilterButtons(categories); // Crée les boutons de filtre avec les catégories récupérées
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

document.addEventListener("DOMContentLoaded", function () {
  loadWorks();
  getCategories();
});

// appel à la fonction loadWorks et initialisation
loadWorks();
