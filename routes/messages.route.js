const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const MessagesDAO = require("../DAO/messages.dao");
const mdao = new MessagesDAO();

router.get("/", async (req, res, next) => {  //Consultar todos los posts
    res.json(await mdao.postMessage(req.body));
})

module.exports = router;