const express = require("express");
const bodyparser = require("body-parser");
const upload = require("express-fileupload");
const session = require("express-session");
const user = require("./route/user");
const admin = require("./route/admin");

require('dotenv').config({ path: '.env.local' }); // optional
require('dotenv').config(); // always load .env

const app = express();

// Middleware
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(upload());
app.use(express.static("public/"));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "asdfghjkl;"
}));

// Routes
app.use("/", user);
app.use("/admin", admin);
// app.use("/whatsapp", whatsappRoutes);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
