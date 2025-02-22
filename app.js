require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./db/connect");

// Extra Security Packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// Routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// extra packages
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, //Limit each IP to 100 request per windowMS
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Authentication middleware
const authenticateUser = require("./middleware/authentication");

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(
        `Server is listening on port ${port}...\n App is Running in http://localhost:3000`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

start();
