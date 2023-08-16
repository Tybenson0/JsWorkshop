const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');  // Make sure you import the 'node-fetch' library

const PORT = 50000;
const app = express();

require('dotenv').config({ path: '../.env' });

const subdomain = process.env.SUBDOMAIN;
const appID = process.env.APPID;
const apiToken = process.env.APITOKEN;

app.use(express.json());

// Set Cross-Origin Resource Sharing (CORS) to allow requests from any origin
app.use(cors());

const multipleRecordsEndpoint = `https://${subdomain}.kintone.com/k/v1/records.json?app=${appID}`
const singleRecordEndpoint = `https://${subdomain}.kintone.com/k/v1/record.json?app=${appID}`;

app.get('/getData', async (req, res) => {
  const fetchOptions = {
    method: "GET",
    headers: {
      "X-Cybozu-API-Token": apiToken
    }
  }
  const response = await fetch(multipleRecordsEndpoint, fetchOptions)
  const jsonResponse = await response.json();
  res.json(jsonResponse);
})

app.post('/postData', async (req, res) => {
  const requestBody = {
    'app': appID,
    'record': {
      'country': {
        'value': req.body.country
      },
      'state': {
        'value': req.body.state
      },
      'city': {
        'value': req.body.city
      },
    }
  }
  const options = {
    'method': 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Cybozu-API-Token': apiToken
    },
    'body': JSON.stringify(requestBody)
  }
  const response = await fetch(singleRecordEndpoint, options);
  const jsonResponse = await response.json();
  res.json(jsonResponse)
})

app.listen(PORT, () => {
  console.log(`Backend server listening at http://localhost:${PORT}`);
});