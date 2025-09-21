// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // serve index.html and assets

// Excel file path
const filePath = path.join(__dirname, 'submission.xlsx');

// Helper function to save data
function saveToExcel(data) {
  let workbook;
  let worksheet;

  // Check if file exists
  if (fs.existsSync(filePath)) {
    workbook = xlsx.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const existingData = xlsx.utils.sheet_to_json(worksheet);
    existingData.push(data);
    worksheet = xlsx.utils.json_to_sheet(existingData);
    workbook.Sheets[workbook.SheetNames[0]] = worksheet;
  } else {
    // Create new workbook
    workbook = xlsx.utils.book_new();
    worksheet = xlsx.utils.json_to_sheet([data]);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Submissions');
  }

  xlsx.writeFile(workbook, filePath);
}

// POST endpoint
app.post('/register', (req, res) => {
  try {
    const { name, email, phone, topic, notes, submittedAt } = req.body;

    if (!name || !email || !topic) {
      return res.status(400).send('Name, email, and topic are required');
    }

    const entry = { Name: name, Email: email, Phone: phone, Topic: topic, Notes: notes, SubmittedAt: submittedAt };
    saveToExcel(entry);

    res.status(200).send('Successfully submitted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
