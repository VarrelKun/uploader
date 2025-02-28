const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.static("public"));

// Buat folder tmp jika belum ada
const tmpDir = "/tmp/uploads";
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
}

// Konfigurasi multer untuk menyimpan file di /tmp
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tmpDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        cb(null, filename);
    },
});
const upload = multer({ storage });

// Endpoint untuk upload gambar
app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // URL tanpa /uploads/
    const fileUrl = `${req.protocol}://${req.get("host")}/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Serve file langsung dari root URL
app.use(express.static(tmpDir));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
