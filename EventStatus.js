// EventStatus.js
async function checkEventStatus(ExecutionID) {
    const url = `https://trclic.zebra.com:9885/automationobjectservice/api/Execution/${ExecutionID}/Status`;
    const headers = {
        'X-Tricentis': 'OK',
        'Authorization': window.AOSAuthorization // Use the global AOSAuthorization variable
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data; // Return the status data
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

// Expose the function to the global scope
window.checkEventStatus = checkEventStatus;
