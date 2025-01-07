const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const {addCandidate, getCandidateInfo, vote, getWinner} = require('./contract');

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/api/candidateInfo/:id', async (req, res) => {
    const data = await getCandidateInfo(req.params.id);
    if(!data.name){
        return res.status(400).json({
            message: 'Candidate Not found',
            success: false,
        });
    }
    res.json({
        message: 'Request completed successfully!',
        success: true,
        data: { id: data.id.toString(), name: data.name }
    });
});

app.get('/api/getWinner', async (req, res) => {
    const winners = await getWinner();

    if(winners.length == 0){
        return res.status(400).json({
            message: 'Results not announced yet!',
            success: false,
        });
    }
    
    res.json({
        message: 'Request completed successfully!',
        success: true,
        data: { winner: winners }
    });
});

app.post('/api/addCandidate', async (req, res) => {
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({
            message: 'Invalid data. "name" field is required.',
            success: false,
        });
    }

    const data = await addCandidate(name);

    res.json({
        message: 'Candidate added successfully!',
        success: true,
        data: { txn: data.txn }
    });
});

app.post('/api/voteCandidate', async (req, res) => {
    const {id} = req.body;

    if (!id) {
        return res.status(400).json({
            message: 'Invalid data. "id" field is required.',
            success: false,
        });
    }

    const data = await vote(id);

    res.json({
        message: 'Candidate voted successfully!',
        success: true,
        data: { txn: data.txn }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
