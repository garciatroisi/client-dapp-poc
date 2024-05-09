const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from the .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Add cors middleware

// Endpoint for a simple "Hello World" ping
app.get('/ping', (req, res) => {
  res.send('Hello World!');
});

// Route handler for uploading to IPFS
app.post('/upload-to-ipfs', async (req, res) => {
  try {
    // Get data from the request body
    const txResult = req.body;
    console.log('Received transaction result:', txResult);

    // Call the function to upload to IPFS
    const ipfsHash = await uploadToIPFS(txResult);

    console.log('ipfsHash: ', ipfsHash);
    // Send response with the IPFS hash
    res.status(200).json({ ipfsHash });
  } catch (error) { 
    console.log('ERRROR!!!!');
    console.error('Error uploading to IPFS:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to upload data to IPFS
async function uploadToIPFS(data) {
    const projectId = process.env.API_KEY;
    const projectSecret = process.env.API_KEY_SECRET;
  
    if (!projectId || !projectSecret) {
      throw new Error('API key or API key secret not found in environment variables');
    }
  
    const authHeader = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
  
    const options = {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
      url: 'https://ipfs.infura.io:5001/api/v0/add',
    };
  
    // Make the request to the Infura API to upload to IPFS using Axios
    const response = await axios(options);
    const result = response.data;
  
    // Return the IPFS hash of the uploaded file
    return result.Hash;
  }
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
