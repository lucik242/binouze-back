const express = require("express");

// const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8080;
const app = express();

app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/uploads", express.static("uploads"));

const apiPhone = require("./routes/phone");
const apiUsers = require("./routes/users");
const apiAuth = require("./routes/auth");

app.use("/phone", apiPhone);
app.use("/users", apiUsers);
app.use("/auth", apiAuth);

app.listen(PORT, () => {
	console.log("server is running in the PORT: " + PORT);
});






