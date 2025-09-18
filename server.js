import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./src/config/db.js";
import router from "./src/router/router.js";
import routerPrivate from "./src/router/routerPrivate.js";
dotenv.config();

const app = express();
// cors
var whitelist = ["http://localhost:5173"];
var corsOptions = {
  origin: function (origin, callback) {
    console.log("🔎 Request from origin:", origin);

    // Cho phép origin nằm trong whitelist hoặc request không có origin (Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({ message: "✅ API is working with CORS whitelist" });
});

app.use("/api", router);
app.use("/api", routerPrivate);
const PORT = process.env.port || 6767;
app.listen(PORT, () => {
  console.log(`backend haot ddong tai  localhost:${PORT}`);
});
