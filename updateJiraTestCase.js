

// updateJiraTestCase.js

async function updateJiraTestCase(issueKey, fieldId, fieldValue) {
  

    try {
        const response = await fetch(
            `http://localhost:3000/updateJira`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer NjIzNDc0MTM5MDExOr8rL80LHLKfi20uQ2iyATlgfg7h'
                },
                body: JSON.stringify({
                    issueKey: issueKey,
                   fieldID:fieldId,
                   fieldValue:fieldValue
                })
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('JIRA test case updated successfully', { [fieldId]: fieldValue });
        return data;
    } catch (error) {
        console.error('Error updating JIRA test case:', error);
        throw error;
    }
}

module.exports = updateJiraTestCase;