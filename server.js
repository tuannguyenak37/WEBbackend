import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./src/config/db.js";
import router from "./src/router/router.js";
import routerPrivate from "./src/router/routerPrivate.js";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import refresh_token from "./src/middleware/refresh_token.js";
import Routerbill from "./src/router/routerBil.js";
// log
import errorLogger from "./src/middleware/log/errorLogger.js";
import requestLogger from "./src/middleware/log/requestLogger.js";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "./src/public")));
var whitelist = [
  "http://localhost:5174",
  "http://192.168.1.100:5173",
  "http://localhost:5173",
];
var corsOptions = {
  origin: function (origin, callback) {
    console.log("🔎 Request from origin:", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // ← quan trọng để gửi cookie
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware đọc cookie từ client gửi lên
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({ message: "✅ API is working with CORS whitelist" });
});
// log
app.use(requestLogger); // log tất cả request

app.use("/api", refresh_token);
app.use("/api", router);
app.use("/api", Routerbill);
app.use("/api/admin", routerPrivate);
app.use(errorLogger);
const PORT = process.env.port || 6767;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
