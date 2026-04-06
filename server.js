require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

const dbConnection = require("./app/config/db");
dbConnection();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

const authRouter = require("./app/routes/userAuthRoute");
app.use(authRouter);

const adminRouter = require("./app/routes/adminRoute");
app.use(adminRouter);

const categoryRouter = require("./app/routes/categoryRoute");
app.use(categoryRouter);

const productRouter = require("./app/routes/productRoute");
app.use(productRouter);

const dashboardRouter = require("./app/routes/dashboardRoute");
app.use(dashboardRouter);

const port = 7005;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
