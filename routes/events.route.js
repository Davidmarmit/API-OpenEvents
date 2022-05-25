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
        next ("wrongEvent");
    }
})

router.get("/", privateRoute, async (req, res, next) => {
    try {
        res.json(await edao.getEvents());
    } catch (err) {
        next ("wrongGetEvent");
    }
})

router.get("/:id", privateRoute, async (req, res, next) => {
    try {
        res.json(await edao.getEventsId(req.params.id));
    } catch (err) {
        next ("wrongGetEvent");
    }
})

router.get("/best", privateRoute, async (req, res, next) => {  //currently in development mode
    const owner_id = req.USER_ID;
    console.log(owner_id);
    try {
        res.json(await edao.getEventsBest(1));
    } catch (err) {
        next ("wrongGetEvent");
    }
})

router.get("/search/", privateRoute, async (req, res, next) => {
    try {
        res.json(await edao.getEventsSearch(req.query.location, req.query.keyword, req.query.date));
    } catch (err) {
        next ("wrongGetEvent");
    }
})

router.put("/:id", privateRoute, async (req, res, next) => {
    try {
        res.json(await edao.putEventsEdit(req.params.id, req.body));
    } catch (err) {
        next ("wrongGetEvent");
    }
})

router.delete("/:id", privateRoute, async (req, res, next) => {
    try {
        res.json(await edao.deleteEvents(req.params.id));
    } catch (err) {
        next ("errorDeleting");
    }
})

router.get("/:id/assistances", privateRoute, async (req, res, next) => {
    try {
        res.json(await edao.getEventsAssistancesId(req.params.id));
    } catch (err) {
        next ("wrongGetEvent");
    }
})

router.get("/events/:event_id/assistances/:user_id", privateRoute, async (req, res, next) => {
    try {
        res.json(await edao.getEventsAssistancesUserId(req.params.event_id, req.params.user_id));
    } catch (err) {
        next ("wrongGetEvent");
    }
})

router.post("/events/:id/assistances", privateRoute, async (req, res, next) => {
    const owner_id = req.USER_ID;
    try {
        res.json(await edao.postEventsAssistancesId(req.params.id, owner_id));
    } catch (err) {
        next ("wrongGetEvent");
    }
})

module.exports = router;