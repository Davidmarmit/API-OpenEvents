const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const EventsDAO = require("../DAO/events.dao");
const edao = new EventsDAO();

router.post("/", privateRoute, async (req, res, next) => {
    const owner_id = req.USER_ID;
    try {
        res.json(await edao.postEvent(req.body, owner_id));
    } catch (err) {
        next (err);
    }
})

router.get("/", privateRoute, async (req, res, next) => {
    try {
        res.json(await edao.getEvents());
    } catch (err) {
        next (err);
    }
})

router.get("/:id", privateRoute, async (req, res, next) => {
    try {
        res.json(await edao.getEventsId(req.params.id));
    } catch (err) {
        next (err);
    }
})

module.exports = router;