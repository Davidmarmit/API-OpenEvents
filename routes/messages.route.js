const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const PostsDAO = require("../DAO/events.dao");
const pdao = new PostsDAO();

router.get("/", async (req, res, next) => {  //Consultar todos los posts
    res.json(await pdao.getAll());
})

module.exports = router;