const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const EventsDAO = require("../DAO/events.dao");
const edao = new EventsDAO();

router.post("/", privateRoute, async (req, res) => {  //Añadir un evento
    const owner_id = req.USER_ID;
    json = await edao.postEvent(req.body, owner_id);
  
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.get("/", privateRoute, async (req, res) => {  //Consultar todos los eventos futuros

    json = await edao.getEvents();

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.get("/search", privateRoute, async (req, res) => {  //Buscar eventos por parametros
    
    json = await edao.getEventsSearch(req.query.location, req.query.keyword, req.query.date);
    
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }

})

router.get("/best", privateRoute, async (req, res) => {  //Consultar eventos filtrados por calificacion
    
    json = await edao.getEventsBest();
    
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.get("/:id", privateRoute, async (req, res) => {  //Consultar evento por id
    
    json = await edao.getEventsId(req.params.id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.put("/:id", privateRoute, async (req, res) => {  //Editar evento por id
        
    json = await edao.putEventsEdit(req.params.id, req.body);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
    
})

router.delete("/:id", privateRoute, async (req, res) => {  //Eliminar evento por id
    
    json = await edao.deleteEvents(req.params.id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
    
})

router.get("/:id/assistances", privateRoute, async (req, res) => {  //COnsultar asistencias por id de evento
        
    json = await edao.getEventsAssistancesId(req.params.id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
    
})

router.get("/:event_id/assistances/:user_id", privateRoute, async (req, res) => {  //Consultar asistencia por id de usuario y evento
        
    json = await edao.getEventsAssistancesUserId(req.params.event_id, req.params.user_id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
  
})

router.post("/:id/assistances", privateRoute, async (req, res) => {  //Publicar asistencia por id de evento
    
    const owner_id = req.USER_ID;
    json = await edao.postEventsAssistancesId(req.params.id, owner_id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
  
})

router.put("/:id/assistances", privateRoute, async (req, res) => {  //Editar asistencia por id de evento
    
    const owner_id = req.USER_ID;
    json = await edao.putEventsAssistancesId(req.params.id, owner_id, req.body.puntuation, req.body.comentary);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
   
})

router.delete("/:id/assistances", privateRoute, async (req, res) => {  //Eliminar asistencia por id de evento
    const owner_id = req.USER_ID;
    json = await edao.deleteEventsAssistancesId(req.params.id, owner_id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
    
})

module.exports = router;