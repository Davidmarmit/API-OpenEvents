const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const EventsDAO = require("../DAO/events.dao");
const edao = new EventsDAO();

router.post("/", privateRoute, async (req, res, next) => {
    const owner_id = req.USER_ID;
    res.json(await edao.postEvent(req.body, owner_id));
    console.log(res);
})

module.exports = router;