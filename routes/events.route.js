const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const EventsDAO = require("../DAO/events.dao");
const edao = new EventsDAO();

router.post("/", privateRoute, async (req, res) => {
    const owner_id = req.USER_ID;
    json = await edao.postEvent(req.body, owner_id);
  
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.get("/", privateRoute, async (req, res) => {

    json = await edao.getEvents();

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.get("/search", privateRoute, async (req, res) => {
    
    json = await edao.getEventsSearch(req.query.location, req.query.keyword, req.query.date);
    
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }

})

router.get("/:id", privateRoute, async (req, res) => {
    
    json = await edao.getEventsId(req.params.id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.get("/best", privateRoute, async (req, res) => {  //currently in development mode
    
    const owner_id = req.USER_ID;
    json = await edao.getEventsBest(1);
    
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.put("/:id", privateRoute, async (req, res) => {
        
    json = await edao.putEventsEdit(req.params.id, req.body);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
    
})

router.delete("/:id", privateRoute, async (req, res) => {
    
    json = await edao.deleteEvents(req.params.id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
    
})

router.get("/:id/assistances", privateRoute, async (req, res) => {
        
    json = await edao.getEventsAssistancesId(req.params.id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
    
})

router.get("/events/:event_id/assistances/:user_id", privateRoute, async (req, res) => {
        
    json = await edao.getEventsAssistancesUserId(req.params.event_id, req.params.user_id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
  
})

router.post("/events/:id/assistances", privateRoute, async (req, res) => {
    
    const owner_id = req.USER_ID;
    json = await edao.postEventsAssistancesId(req.params.id, owner_id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
  
})

router.put("/events/:id/assistances", privateRoute, async (req, res) => {
    
    const owner_id = req.USER_ID;
    json = await edao.putEventsAssistancesId(req.params.id, owner_id, req.body.puntuation, req.body.comentary);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
   
})

router.delete("/events/:id/assistances", privateRoute, async (req, res) => {
    const owner_id = req.USER_ID;
    json = await edao.deleteEventsAssistancesId(req.params.id, owner_id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
    
})

module.exports = router;