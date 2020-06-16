const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API!",
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secret", (err, authData) => {
    if (err) {
      res.status(403).json({ error: "forbidden route" });
    } else {
      res.status(200).json({
        message: "Post created...",
        authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  //Sample user
  const user = {
    id: 1,
    username: "samson",
    email: "samson@email.com",
  };

  jwt.sign({ user }, "secret", { expiresIn: "30s" }, (err, token) => {
    res.json({
      token,
    });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({ error: "forbidden route" });
  }
}

app.listen(5000, () => console.log("Server running on Port 5000"));
