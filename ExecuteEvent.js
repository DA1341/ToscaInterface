// ExecuteEvent.js
async function ExecuteEvent(EventID) {
  const url = `${Endpoint}/automationobjectservice/api/Execution/Enqueue`;
  const payload = {
    "projectName": "ZebraProjects",
    "executionEnvironment": "Dex",
    "events": [{"eventId": EventID}],
    "importResult": true,
    "creator": "ToscaClient"
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Tricentis': 'OK',
    'Authorization': window.AOSAuthorization // Use the global AOSAuthorization variable
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    console.log('Execution Response:', data); // Outputs the response

    // Store ExecutionId in a variable for next use
    const ExecutionId = data.ExecutionId;
    console.log('ExecutionId:', ExecutionId);

    return ExecutionId; // Return the ExecutionId

  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Expose the function to the global scope
window.ExecuteEvent = ExecuteEvent;
