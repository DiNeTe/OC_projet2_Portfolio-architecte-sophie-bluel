document.querySelector('.formLogin').addEventListener('submit', async function(event) {
    event.preventDefault();

    console.log('Le formulaire a été soumis');
    
    var emailLogin = document.getElementById('emailLogin').value;
    var password = document.getElementById('password').value;
    
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailLogin,
                password: password
            })
        });
        if (!response.ok) {
            throw new Error('Erreur de connexion');
        }
        const data = await response.json();
        console.log('Token:', data.token); // Affiche le token dans la console
    } catch (error) {
        alert(error.message);
    }
});