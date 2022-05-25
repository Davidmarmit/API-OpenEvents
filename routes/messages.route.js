const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const MessagesDAO = require("../DAO/messages.dao");
const mdao = new MessagesDAO();

router.post("/", privateRoute, async (req, res, next) => { 
    json = await mdao.postMessage(req.body);
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.get("/users", privateRoute, async (req, res, next) => {
    const owner_id = req.USER_ID;
    json = await mdao.getMessagesUser(owner_id);
    if (json.error) {
        res.status(404).json(json);
    } else {
        res.json(json);
    }
})

router.get("/:id", privateRoute, async (req, res, next) => {
    const owner_id = req.USER_ID;
    json = await mdao.getMessagesUserId(req.params.id, owner_id);
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})


module.exports = router;