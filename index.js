const express = require("express");
const cors = require("cors");
const mongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const PORT = process.env.PORT || 3000;
const URL = "mongodb://localhost:27017";

app.get("/users", async (req, res) => {
  try {
    var client = await mongoClient.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let db = client.db("react_users");
    let usersData = await db
      .collection("users")
      .find()
      .project({ _id: 0, name: 1, age: 1 })
      .toArray();
    res.json({
      data: usersData,
    });
  } catch (err) {
    if (client) {
      client.close();
    }
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.post("/users", async (req, res) => {
  try {
    let name = req.body.name;
    let age = req.body.age;
    var client = await mongoClient.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let db = client.db("react_users");
    let user = await db.collection("users").findOne({ name });
    if (user) {
      res.json({
        message: "user already present",
      });
      client.close();
      return;
    }
    await db.collection("users").insertOne({ name, age });
    client.close();
    res.json({
      message: "success",
    });
  } catch (err) {
    if (client) {
      client.close();
    }
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.put("/users/:name", async (req, res) => {
  try {
    let name = req.params.name;
    var client = await mongoClient.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let db = client.db("react_users");
    await db
      .collection("users")
      .findOneAndUpdate({ name }, { $set: { age: req.body.age } });
    client.close();
    res.json({
      message: "success",
    });
  } catch (err) {
    if (client) {
      client.close();
    }
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.delete("/users/:name", async (req, res) => {
  try {
    let name = req.params.name;
    var client = await mongoClient.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let db = client.db("react_users");
    await db.collection("users").findOneAndDelete({ name });
    res.json({
      message: "success",
    });
  } catch (err) {
    if (client) {
      client.close();
    }
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.listen(PORT, () => console.log("server started"));
