const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const UserRouter = require("./routes/User.route.js");
const uploadRouter = require("./routes/UploadRoute.js");
const chartRouter = require("./routes/ChartRoute.js");
const adminRouter = require("./routes/AdminRoute.js");
const aiSuggetionRoutes = require("./routes/AiRoute.js");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//http://localhost:3000/user/register
//http://localhost:3000/user/login
//http://localhost:3000/user/logout
//http://localhost:3000/user/forgot-password
//http://localhost:3000/user/create-new-password
//http://localhost:3000/user/delete-account/id
app.use("/user", UserRouter);

//Post--http://localhost:3000/upload/file
//get---http://localhost:3000/upload/record/:id
//get--http://localhost:3000/upload/upload-history
//delete--http://localhost:3000/upload/delete/:id
//Analyze- get-http://localhost:3000/upload/analyze/:id

app.use("/upload", uploadRouter);

// post--http://localhost:3000/charts/save
//get--http://localhost:3000/charts/history
//Delete--http://localhost:3000/charts/delete/:id

app.use("/charts", chartRouter);

//get--http://localhost:3000/admin/all-users
//delete--http://localhost:3000/admin/delete-user
//get--http://localhost:3000/admin/all-files
//get--http://localhost:3000/admin/all-charts
//get--http://localhost:3000/admin/all-insights

//get--http://localhost:3000/admin/user/${userId}
//get--http://localhost:3000/admin/files/user/${userId}
//get--http://localhost:3000/admin/charts/user/${userId}
app.use("/admin", adminRouter);
// -- http://localhost:3000/ai/suggest/:recordId
app.use("/ai", aiSuggetionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is runnig..${PORT}`);
      console.log("MongoDB Connected....");
      return " Hello World";
    });
  })
  .catch((err) => console.error("DB Error:", err));
