// CSS importé depuis le HTML pour eviter effet de rechargement index/login

let allWorks = []; // Variable globale pour stocker tous les travaux

async function loadWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        allWorks = await response.json(); // Stocke les travaux dans la variable globale

        renderGallery(allWorks); // Affiche tous les travaux initialement
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);
    }
}

function renderGallery(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Nettoie la galerie avant d'ajouter de nouveaux travaux

    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(figure);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadWorks();
    getCategories();
});

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

// Fonction pour filtrer la galerie
function filterGallery(category) {
    if (category === 'all') {
        renderGallery(allWorks);
    } else {
        const filteredWorks = allWorks.filter(work => {
            const isMatch = work.category.name === category.name;
            console.log(`Comparaison : ${work.category.name} === ${category.name}`, isMatch);
            return isMatch;
        });
        renderGallery(filteredWorks);
    }
}

// appel à la fonction loadWorks et initialisation
loadWorks();
document.addEventListener('DOMContentLoaded', getCategories);