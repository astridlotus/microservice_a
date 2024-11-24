const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const { parse } = require('json2csv');  // Import the parse function from json2csv
const fs = require('fs');
const path = require('path');

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:5173'
}

const app = express();
app.use(express.json());
app.use(cors(corsOptions));


// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

/**
 * Endpoint to upload a csv file and covert it to JSON
 * @param {Request} req - Express request object
 * @param {Object} req.file - The uploaded CSV file (accessible through `multer`)
 * @param {string} req.file.originalname - Original file name
 * @param {Buffer} req.file.buffer - File buffer containing the CSV data
 * @param {Response} res - Express response object
 * @returns {JSON} JSON representation of the uploaded CSV data
 * @throws {400} If no file is uploaded
 *
 * @example
 * // Example response:
 * [
 *   { "name": "John", "age": "30", "city": "New York" },
 *   { "name": "Jane", "age": "25", "city": "Los Angeles" }
 * ]
 */
app.post('/upload-csv', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, req.file.path);
  const results = [];

  // Read the CSV file as a stream and convert to JSON
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Clean up the uploaded file
      fs.unlinkSync(filePath);
      res.json(results);
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
});


//Json to text
app.post('/convert-to-text', (req, res) => {
  const jsonData = req.body;

  // Check if JSON is provided
  if (!jsonData || typeof jsonData !== 'object') {
      return res.status(400).send('Invalid JSON input');
  }

  // Convert JSON to plain text format
  const textResponse = Object.entries(jsonData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

  // Return the plain text response
  res.type('text').send(textResponse);
});



//json to csv
app.post('/convert-to-csv', (req, res) => {
  const jsonData = req.body;

  // Check if JSON is provided and is an array of objects
  if (!jsonData || !Array.isArray(jsonData)) {
      return res.status(400).send('Invalid JSON input. Expected an array of objects.');
  }

  try {
      // Convert JSON to CSV
      const csv = parse(jsonData);

      // Set the response type as CSV and send the CSV data
      res.header('Content-Type', 'text/csv');
      res.attachment('output.csv');
      res.send(csv);
  } catch (err) {
      res.status(500).send('Error converting JSON to CSV' + err);
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
