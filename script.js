// Global variables
const ProjectUID = "39f6db34-1fc9-0d22-3d30-e13242c67adb";
const ApprovedFolder = "01_Approved";
const WorkspaceName = "RestAPI";
const RestAPIEndpoint = "https://trclic.zebra.com:9885/rest/toscacommander";
const Endpoint = "https://trclic.zebra.com:9885"; // Added global variable
const EventStatus = "Status";
const EventResults = "results";
const EventResultSummary = "Results/summary";


// Global headers object
let headers = {
  'Content-Type': 'application/json',
  'Authorization': ''
};
document.addEventListener('DOMContentLoaded', () => {
  handleTestdataChange();
  document.getElementById('testdata').addEventListener('change', handleTestdataChange);
  document.getElementById('execute').addEventListener('click', saveValues);
  
  document.getElementById('clear-logs').addEventListener('click', clearLogs);
  
      // Generate token on load
    window.generateToken().then((token) => {
        //console.log('Generated Token:', token);
        // Store the token globally
        window.AOSAuthorization = token;
    }).catch((error) => {
        console.error('Failed to generate token:', error);
});

  
  loadTableData();
  // Start monitoring execution statuses
    setInterval(monitorExecutionStatuses, 10000); // Check every 10 seconds


});

function handleTestdataChange() {
  const testdata = document.getElementById('testdata').value;
  const tdsRowKey = document.getElementById('tds-row-key');
  const reinstantiation = document.getElementById('reinstantiation');
  if (testdata === 'TDS') {
    tdsRowKey.style.display = 'block';
    reinstantiation.style.display = 'none';
    document.getElementById('tds-key').required = true;
    document.getElementById('reinstantiation-select').required = false;
  } else if (testdata === 'Excel') {
    tdsRowKey.style.display = 'none';
    reinstantiation.style.display = 'block';
    document.getElementById('tds-key').required = false;
    document.getElementById('reinstantiation-select').required = true;
  } else {
    tdsRowKey.style.display = 'none';
    reinstantiation.style.display = 'none';
    document.getElementById('tds-key').required = false;
    document.getElementById('reinstantiation-select').required = false;
  }
}

function saveValues(event) {
  event.preventDefault(); // Prevent form submission
  const team = document.getElementById('team').value;
  const testcaseName = document.getElementById('testcase-name').value.trim();
  const jiraId = document.getElementById('jira-id').value.trim();
  const user = document.getElementById('user').value.trim();
  const testdata = document.getElementById('testdata').value;
  const tdsKey = document.getElementById('tds-key').value.trim();
  const reinstantiation = document.getElementById('reinstantiation-select').value;
  let isValid = true;

  // Validate mandatory fields
  if (!team) {
    const teamError = document.getElementById('team-error');
    teamError.textContent = 'This field is required.';
    teamError.style.display = 'block';
    document.getElementById('team').classList.add('highlight-error');
    isValid = false;
  } else {
    const teamError = document.getElementById('team-error');
    teamError.style.display = 'none';
    document.getElementById('team').classList.remove('highlight-error');
  }

  if (!testcaseName) {
    const testcaseNameError = document.getElementById('testcase-name-error');
    testcaseNameError.textContent = 'This field is required.';
    testcaseNameError.style.display = 'block';
    document.getElementById('testcase-name').classList.add('highlight-error');
    isValid = false;
  } else {
    const testcaseNameError = document.getElementById('testcase-name-error');
    testcaseNameError.style.display = 'none';
    document.getElementById('testcase-name').classList.remove('highlight-error');
  }

  if (!jiraId) {
    const jiraIdError = document.getElementById('jira-id-error');
    jiraIdError.textContent = 'This field is required.';
    jiraIdError.style.display = 'block';
    document.getElementById('jira-id').classList.add('highlight-error');
    isValid = false;
  } else {
    const jiraIdError = document.getElementById('jira-id-error');
    jiraIdError.style.display = 'none';
    document.getElementById('jira-id').classList.remove('highlight-error');
  }

  if (!user) {
    const userError = document.getElementById('user-error');
    userError.textContent = 'This field is required.';
    userError.style.display = 'block';
    document.getElementById('user').classList.add('highlight-error');
    isValid = false;
  } else {
    const userError = document.getElementById('user-error');
    userError.style.display = 'none';
    document.getElementById('user').classList.remove('highlight-error');
  }

  if (testdata && !testdata.trim()) {
    const testdataError = document.getElementById('testdata-error');
    testdataError.textContent = 'This field is required.';
    testdataError.style.display = 'block';
    document.getElementById('testdata').classList.add('highlight-error');
    isValid = false;
  } else {
    const testdataError = document.getElementById('testdata-error');
    testdataError.style.display = 'none';
    document.getElementById('testdata').classList.remove('highlight-error');
  }

  // Validate TDS Key if TDS is selected
  if (testdata === 'TDS' && !tdsKey) {
    const tdsKeyError = document.getElementById('tds-key-error');
    tdsKeyError.textContent = 'This field is required.';
    tdsKeyError.style.display = 'block';
    document.getElementById('tds-key').classList.add('highlight-error');
    isValid = false;
  } else {
    const tdsKeyError = document.getElementById('tds-key-error');
    tdsKeyError.style.display = 'none';
    document.getElementById('tds-key').classList.remove('highlight-error');
  }

  // Validate Reinstantiation if Excel is selected
  if (testdata === 'Excel' && !reinstantiation) {
    const reinstantiationError = document.getElementById('reinstantiation-error');
    reinstantiationError.textContent = 'This field is required.';
    reinstantiationError.style.display = 'block';
    document.getElementById('reinstantiation-select').classList.add('highlight-error');
    isValid = false;
  } else {
    const reinstantiationError = document.getElementById('reinstantiation-error');
    reinstantiationError.style.display = 'none';
    document.getElementById('reinstantiation-select').classList.remove('highlight-error');
  }

  if (isValid) {
	  
	  // Append new row to the table with initial data
        const details = {
            createdTime: new Date().toLocaleString(),
            testcase: document.getElementById('testcase-name').value.trim(),
            jiraId: document.getElementById('jira-id').value.trim(),
            executionStatus: 'Pending',
            result: 'Pending',
            user: document.getElementById('user').value.trim(),
            executionId: null // Placeholder for ExecutionId
        };
        const newRow = prependRowToTable(details);
        saveTableData();

		
    // Generate Basic Authorization

    const username = "DexUser";
    const password = "Admin@1";
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);
    headers['Authorization'] = `Basic ${encodedCredentials}`;
    console.log('Authorization:', headers['Authorization']); 
const Authorization = `Basic ${encodedCredentials}`;



    // Checkin all
    checkinall().then(() => 
	/*{
		
// Call updateAll after checkinall
      return updateAll();
	   }).then(() => */{
	   
      // Construct FindTeamFolder variable
      const FindTeamFolder = `->SUBPARTS:TCComponentFolder[Name==\"${team}\"]`;

      // Call TQLSearch function and save the response in a variable
     return TQLSearch(ProjectUID, FindTeamFolder);
    }).then(TeamFolderUID => {
		
		if (TeamFolderUID) {
        // Construct FindTestEvent variable
        const FindTestEvent = `->SUBPARTS:TCComponentFolder[Name==\"${ApprovedFolder}\"]=>SUBPARTS:TestEvent[Name==\"${testcaseName}\"]`;
        // Call findTestEvent function
        return TQLSearch(TeamFolderUID,FindTestEvent);
      } else {
        console.log('TeamFolderUID not found');
        return null;
      }
    })
	// After obtaining EventID
.then(EventID => {
    if (EventID !== "Not Found") {
        console.log('EventID:', EventID);
        
        // Call ExecuteEvent with EventID
        return ExecuteEvent(EventID);
    } else {
        console.log('TestEvent not found');
        return null;
    }
})
.then(ExecutionId => {
    if (ExecutionId) {
        console.log('ExecutionId:', ExecutionId);
        // Store ExecutionId in a variable for next use
        window.ExecutionId = ExecutionId;
		
		

                // Update the status in the table row
                updateRowStatus(newRow, 'Queued', 'In Progress');
                newRow.dataset.executionId = ExecutionId; // Store ExecutionId in the row for monitoring
                updateTableDataWithExecutionId(details.createdTime, ExecutionId);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Update the status in the table row to indicate failure
            updateRowStatus(newRow, 'Execution trigger failed', 'No result', true);
        });
    }
}

function prependRowToTable(details) {
    const tableBody = document.querySelector('#execution-details tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${details.createdTime}</td>
        <td>${details.testcase}</td>
        <td>${details.jiraId}</td>
        <td>${details.executionStatus} <span class="in-progress"></span></td>
        <td>${details.result}</td>
        <td>${details.user}</td>
    `;

    tableBody.insertBefore(newRow, tableBody.firstChild);

    // Limit the number of rows to 10
    if (tableBody.rows.length > 10) {
        tableBody.deleteRow(10);
    }

    return newRow;
}

function updateRowStatus(row, executionStatus, result, isError = false) {
    if (isError) {
        row.cells[3].innerHTML = `${executionStatus} <span class="cross-mark">&#10060;</span>`;
    } else if (executionStatus === 'Completed') {
        row.cells[3].innerHTML = `${executionStatus} <span class="green-tick">&#10004;</span>`;
    } else {
        row.cells[3].innerHTML = `${executionStatus} <span class="in-progress"></span>`;
    }
    row.cells[4].textContent = result;
}


function saveTableData() {
    const tableData = [];
    const rows = document.querySelectorAll('#execution-details tbody tr');
    rows.forEach(row => {
        const details = {
            createdTime: row.cells[0].textContent,
            testcase: row.cells[1].textContent,
            jiraId: row.cells[2].textContent,
            executionStatus: row.cells[3].textContent.split(' ')[0], // Extract status text
            result: row.cells[4].textContent,
            user: row.cells[5].textContent,
            executionId: row.dataset.executionId || null
        };
        tableData.push(details);
    });
    localStorage.setItem('tableData', JSON.stringify(tableData));
}

function loadTableData() {
    const tableData = JSON.parse(localStorage.getItem('tableData')) || [];
    tableData.reverse().forEach(details => {
        const newRow = prependRowToTable(details);
        if (details.executionId) {
            newRow.dataset.executionId = details.executionId;
        }
        updateRowStatus(newRow, details.executionStatus, details.result);
    });
}

function updateTableDataWithExecutionId(createdTime, executionId) {
    let tableData = JSON.parse(localStorage.getItem('tableData')) || [];
    tableData = tableData.map(details => {
        if (details.createdTime === createdTime) {
            details.executionId = executionId;
        }
        return details;
    });
    localStorage.setItem('tableData', JSON.stringify(tableData));
}


function monitorExecutionStatuses() {
    const tableData = JSON.parse(localStorage.getItem('tableData')) || [];
    tableData.forEach(details => {
        if (details.executionId && details.executionStatus !== 'Completed' && details.executionStatus !== 'Execution trigger failed') {
            ExecutionDetails(details.executionId, EventStatus).then(statusData => {
                const row = document.querySelector(`tr[data-execution-id="${details.executionId}"]`);
                if (row) {
                    updateRowStatus(row, statusData.status, statusData.isResultImported ? 'Result Imported' : 'In Progress');
                }
                details.executionStatus = statusData.status;
                details.result = statusData.isResultImported ? 'Result Imported' : 'In Progress';

                if (statusData.status === 'Completed') {
                    ExecutionDetails(details.executionId, EventResultSummary).then(summaryData => {
                        const resultText = Object.entries(summaryData)
                            .filter(([key, value]) => value !== 0)
                            .map(([key, value]) => {
                                switch (key) {
                                    case 'passed':
                                        return `<span class="green-tick">Passed:</span> ${value}`; // Green tick mark &#10004
                                    case 'failed':
                                        return `<span class="red-cross">Failed:</span> ${value}`; // Red cross mark &#10060;
                                    case 'skipped':
                                        return `<span class="skipped">Skipped:</span> ${value}`;
                                    case 'inProgress':
                                        return `<span class="in-progress-icon">&#x27F3;</span> ${value}`; // Round running circle
                                    case 'unknown':
                                        return `<span class="unknown">Unknown:</span> ${value}`;
                                    default:
                                        return `${key}: ${value}`;
                                }
                            })
                            .join(', ');

                        if (row) {
                            row.cells[4].innerHTML = resultText;
                        }
                        details.result = resultText;
                        saveTableData();

                        // Call updateJiraTestCase when execution is completed
                        updateJiraTestCase(details.jiraId, Jira_TestCaseIDField, "Passed")
                            .then(response => {
                                console.log('JIRA test case updated successfully:', response);
                            })
                            .catch(error => {
                                console.error('Error updating JIRA test case:', error);
                            });
                    }).catch(error => {
                        console.error('Error fetching result summary:', error);
                    });
                }
            }).catch(error => {
                console.error('Error checking status:', error);
            });
        }
    });
}




function clearLogs() {
    // Clear the table body
    const tableBody = document.querySelector('#execution-details tbody');
    tableBody.innerHTML = '';

    // Clear the localStorage
    localStorage.removeItem('tableData');
}
