const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Cho phép truy cập file tĩnh ở thư mục public/
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Khởi tạo multer để nhận file gửi lên từ form
const upload = multer();

// Route trang chính (nếu dùng HTML đơn giản)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route nhận file ảnh từ Mini App và forward về n8n
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    // Lấy buffer của ảnh crop từ Mini App gửi lên
    const imageBuffer = req.file.buffer;

    // Gửi ảnh về n8n webhook (Content-Type: image/png hoặc octet-stream)
    const response = await fetch('https://kimun0608.app.n8n.cloud/webhook/f224b459-69e9-49d0-aba4-1adf0a8440ec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="image.png"'
      },
      body: imageBuffer
    });

    const n8nResult = await response.text();
    res.json({ ok: true, n8n: n8nResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Khởi động server
app.listen(PORT, () => console.log('Server running on port', PORT));
