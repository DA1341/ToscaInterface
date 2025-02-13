// AOSAuth.js
async function generateToken() {
    const url = `${Endpoint}/tua/connect/token`;
    const body = 'grant_type=client_credentials&client_id=PzH4HeNGv0GeIHY5H4EnJA&client_secret=ioVanwot3USTPGqNjnc7gg-gaLaH4cGkGqS1-Ln-vBfA';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        const token = `Bearer ${data.access_token}`;
        return token; // Return the token
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

// Expose the function to the global scope
window.generateToken = generateToken;
