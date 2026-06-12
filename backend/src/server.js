import express from "express";
import { ENV } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";


const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json()); //req.body will be undefined without this middleware, because express doesn't know how to parse the incoming request body. This middleware parses incoming requests with JSON payloads and is based on body-parser.
//app.use(express.urlencoded({ extended: true })); //This middleware parses incoming requests with URL-encoded payloads, which are typically used when submitting form data. The extended: true option allows for rich objects and arrays to be encoded into the URL-encoded format, using the qs library. If you set it to false, it will use the querystring library, which does not support nested objects.

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// app.listen(PORT, () => {
//     console.log("Server running on port: " + PORT);
//     connectDB();
// });

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    })