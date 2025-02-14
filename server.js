const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.put('/updateJira', async (req, res) => {
     const { issueKey, fieldID, fieldValue } = req.body;
    const url = `https://jira.zebra.com/rest/api/2/issue/${issueKey}`;
const data = {
    "fields": {
        [fieldID]: fieldValue
    }
};

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer NjIzNDc0MTM5MDExOr8rL80LHLKfi20uQ2iyATlgfg7h'
    }
};

try {
        const response = await axios.put(url, data, config);
        console.log('Response:', response.data); // Debugging log
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error updating JIRA test case:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
