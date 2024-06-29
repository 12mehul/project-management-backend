require("dotenv").config();
const express = require("express");
const connectToDB = require("./db/db");
const cors = require("cors");
const app = express();

const users = require("./routes/users");
const projects = require("./routes/projects");
const tasks = require("./routes/tasks");

const port = 3001;

app.use(express.static("./public"));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://project-management-frontend-sigma.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/node", (req, res) => res.send("Hello world"));
app.use("/api/users", users);
app.use("/api/projects", projects);
app.use("/api/tasks", tasks);

const startConnection = async () => {
  try {
    await connectToDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};
startConnection();
