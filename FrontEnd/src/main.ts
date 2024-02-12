import './assets/style.css'

// Fonction pour récupérer les travaux depuis l'API
async function loadWorks() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      const works = await response.json();
  
      const gallery = document.querySelector('.gallery');
      works.forEach(work => {
        const figure = document.createElement('figure');
        figure.innerHTML = `
          <img src="${work.imageUrl}" alt="${work.title}">
          <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(figure);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des travaux:', error);
    }
  }

// Fonction pour récupérer les catégories depuis l'API
async function getCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const categories = await response.json(); // Convertir la réponse en JSON
        createFilterButtons(categories); // Créer les boutons de filtre avec les catégories récupérées
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Fonction pour créer les boutons de filtre
function createFilterButtons(categories) {
    const filters = document.querySelector('.filters');

    filters.innerHTML = '';

    const allButton = document.createElement('button');
    allButton.innerText = 'Tous';
    allButton.classList.add('filter-button');
    allButton.onclick = function() { filterGallery('all'); };
    filters.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.innerText = category.name;
        button.classList.add('filter-button');
        button.onclick = function() { filterGallery(category); };
        filters.appendChild(button);
    });
}

// // Fonction pour filtrer la galerie
// function filterGallery(category) {
//     // Logique pour filtrer les projets dans la galerie en fonction de la catégorie cliquée
//     console.log(`Filtrer la galerie pour la catégorie: ${category}`);
//     // Vous mettriez à jour la galerie ici
// }

// appel à la fonction loadWorks
loadWorks();

// Initialise les boutons filtre au chargement de la page
document.addEventListener('DOMContentLoaded', getCategories);