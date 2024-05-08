const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3001; // Choose a different port if needed
const UPLOAD_DIR = path.join(__dirname, 'files');

// Ensure the `files` directory exists
const fs = require('fs');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Set up EJS as the view engine and set the views folder to the `views` directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure Multer to save files to the `files` directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route to render the upload form (points to `upload.ejs`)
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.send('File uploaded successfully!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Upload server running at http://localhost:${PORT}/upload Please add upload after the / else you will get cannot get /`);
});
