const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const PostsDAO = require("../DAO/assistances.dao");
const pdao = new PostsDAO();

router.get("/", privateRoute, async (req, res) => {  //Peticion para desarrollo
    let json = await pdao.getAll();
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.status(200).json(json);
    }
})

router.get("/:user_id/:event_id", privateRoute, async (req, res) => {  //Consultar asistencia por id de evento y usuario
    let json = await pdao.getAssistances(req.params.user_id, req.params.event_id)

    if(json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.post("/:user_id/:event_id", privateRoute, async (req, res) => {  //Publicar asistencia por id de evento y usuario
    let json = res.json(await pdao.postAssistances(req.params.user_id, req.params.event_id));
    if(json.error){
        res.status(400).json(json);
    } else {
        res.status(200).json(json);
    }
})

router.put("/:user_id/:event_id", privateRoute, async (req, res) => {  //Editar asistencia por id de evento y usuario
    let json = await pdao.putAssistances(req.params.user_id, req.params.event_id,req.body)
    if(json.error){
        res.status(400).json(json);
    } else {
        res.status(200).json(json);
    }
})

router.delete("/:user_id/:event_id", privateRoute, async (req, res) => {  //Eliminar asistencia por id de evento y usuario
    let json = await pdao.deleteAssistances(req.params.user_id, req.params.event_id)
    if(json.error){
        res.status(400).json(json);
    } else {
        res.status(200).json(json);
    }
})

module.exports = router;