const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const PostsDAO = require("../DAO/assistances.dao");
const pdao = new PostsDAO();

router.get("/assistances/:user_id/:event_id", async (req, res, next) => {  //Consultar todos los posts
    json = await pdao.getAssistances(req.params.user_id, req.params.event_id)

    if(json.error.length > 0) {
        res.status(404).json(json);
    } else{
        res.json(json);
    }

    //res.json(await pdao.getAssistances(req.params.user_id, req.params.event_id));


})

router.post("/assistances", async (req, res, next) => {  //Consultar todos los posts
    res.json(await pdao.postAssistances(req.params.user_id, req.params.event_id));
})

router.put("/assistances", async (req, res, next) => {  //Consultar todos los posts
    res.json(await pdao.putAssistances(req.params.user_id, req.params.event_id,req.body));
})

router.delete("/assistances", async (req, res, next) => {  //Consultar todos los posts
    res.json(await pdao.deleteAssistances());
})

module.exports = router;