(async function(global) {
  async function updateJiraTestCase(issueKey, fieldId, fieldValue) {
    const username = 'DA1341';
    const password = 'Cheers@54321';
    const credentials = btoa(`${username}:${password}`);
	
	console.log('fieldValue',  { [fieldId]: fieldValue });
    
    try {
      const response = await fetch(
        `${JIRA_BASE_URL}/rest/api/2/issue/${issueKey}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
          },
          body: JSON.stringify({
            fields: {
              [fieldId]: fieldValue
            }
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

  global.updateJiraTestCase = updateJiraTestCase;
})(window);
