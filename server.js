const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer for handling single file uploads to a directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDirExs = file.originalname.split("_");
        let uploadDirEx = 'uploads/' + uploadDirExs[uploadDirExs.length -2];
        if (!fs.existsSync(uploadDirEx)) {
            fs.mkdirSync(uploadDirEx);
        }
        cb(null, uploadDirEx);
    },
    filename: (req, file, cb) => {
        const uniqueName = file.originalname.split("_")[file.originalname.split("_").length - 1];
        cb(null, uniqueName);
    }
});
const upload = multer({ storage }).any(); // Accept any form field with files

// Handle the upload route
app.post('/uploads', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(500).json({ error: 'File upload failed.' });
        }

        try {
            // Extract the files from the 'multi_file' field (which is an array of objects)
            const multiFiles = req.body.multi_file;
            if (!multiFiles) {
                return res.status(400).json({ error: 'No files uploaded.' });
            }

            // Convert to an array if not already (for consistency)
            const filesArray = Array.isArray(multiFiles) ? multiFiles : [multiFiles];

            // Move uploaded files into 'uploads' directory
            const uploadedFiles = req.files.map(file => ({
                originalName: file.originalname,
                filename: file.filename,
                path: file.path
            }));

            console.log('Files Uploaded:', uploadedFiles);

            res.status(200).json({
                message: 'Files uploaded successfully!',
                files: uploadedFiles
            });
        } catch (error) {
            console.error('Processing Error:', error);
            res.status(500).json({ error: 'An error occurred while processing files.' });
        }
    });
});

// POST route to upload a file
app.post('/pdown', (req, res) => {
    upload(req, res, ()=>{});
    // const filePath = path.join(__dirname, 'uploads', 'p2.zip'); // Adjust as needed
    // res.download(filePath, 'p.zi', (err) => {
    //     if (err) {
    //         console.error('Error downloading the file:', err);
    //         res.status(500).send('Error downloading the file.');
    //     }
    // });
});

app.get('/client', (req, res) => {
    res.status(200).send('success');
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://192.168.129.23:${PORT}`);
});
