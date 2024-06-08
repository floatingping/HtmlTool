

const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// 設定靜態資源目錄
app.use("/static", express.static(path.join(__dirname, "static")));

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});

