const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const MessagesDAO = require("../DAO/messages.dao");
const mdao = new MessagesDAO();

router.post("/", privateRoute, async (req, res, next) => { 
    res.json(await mdao.postMessage(req.body));
})

router.get("/users", privateRoute, async (req, res, next) => {
    const owner_id = req.USER_ID;
    res.json(await mdao.getMessagesUser(owner_id));
})

router.get("/:id", privateRoute, async (req, res, next) => {
    const owner_id = req.USER_ID;
    res.json(await mdao.getMessagesUserId(req.params.id, owner_id));
})


module.exports = router;