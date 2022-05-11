const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const CommentsDAO = require("../DAO/events.dao");
const cdao = new CommentsDAO();

router.post("/", privateRoute, async (req, res, next) => {  //Comentar un post, solo usuario autenticado
    res.json(await cdao.post(req.body));
})

module.exports = router;