const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const ROOT_DIR = path.join(__dirname, 'files'); // Adjust this to your desired root folder

app.set('view engine', 'ejs');

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// List files and directories
app.get('/', (req, res) => {
    const requestedPath = req.query.path ? path.join(ROOT_DIR, req.query.path) : ROOT_DIR;

    // Make sure the requested path is within the root directory
    if (!requestedPath.startsWith(ROOT_DIR)) {
        return res.status(400).send('Invalid path');
    }

    fs.readdir(requestedPath, { withFileTypes: true }, (err, items) => {
        if (err) return res.status(500).send('Error reading directory');

        const entries = items.map(item => ({
            name: item.name,
            type: item.isDirectory() ? 'directory' : 'file',
            path: path.relative(ROOT_DIR, path.join(requestedPath, item.name))
        }));

        const currentPath = path.relative(ROOT_DIR, requestedPath);
        res.render('index', { entries, currentPath });
    });
});

// Download files
app.get('/download', (req, res) => {
    const filePath = path.join(ROOT_DIR, req.query.path || '');

    // Ensure the file is within the root directory
    if (!filePath.startsWith(ROOT_DIR)) {
        return res.status(400).send('Invalid path');
    }

    res.download(filePath, err => {
        if (err) res.status(500).send('Error downloading file');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
