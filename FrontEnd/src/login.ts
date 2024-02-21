function resetlocalStorageToken() {
  localStorage.removeItem("userToken");
}

resetlocalStorageToken();

// Sélectionne le formulaire avec la classe 'formLogin' et  écoute l'événement 'submit'
document
  .querySelector(".formLogin")
  ?.addEventListener("submit", async function (event) {
    // Empêche le rechargement de la page
    event.preventDefault();

    console.log("clic bouton ok");

    // Récupère la valeur de l'élément input pour l'email
    const emailLogin =
      document.querySelector<HTMLInputElement>("#emailLogin")?.value;
    // Récupère la valeur de l'élément input pour le mot de passe
    const password =
      document.querySelector<HTMLInputElement>("#password")?.value;

    if (!emailLogin || !password) {
      alert("Veuillez remplir tous les champs pour vous connecter");
      return;
    }

    try {
      // Envoie une requête asynchrone à l'API pour la connexion
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailLogin, // Envoie l'email
          password: password, // Envoie le mot de passe
        }),
      });

      // Vérifie si la réponse n'est pas OK
      if (!response.ok) {
        // Lance une nouvelle erreur si la réponse n'est pas 'ok'
        throw new Error("Erreur de connexion");
      }

      // Converti la réponse en JSON
      const data = await response.json();

      // Stocke le token et redirige si la connexion est réussie
      if (data.token) {
        localStorage.setItem("userToken", data.token);
        window.location.href = "/index.html";
      }
    } catch (error) {
      // Affiche une alerte en cas d'erreur
      alert("E-mail ou mot de passe incorrect");
    }
  });

// //  check si le token est dans le local storage
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
