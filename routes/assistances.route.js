const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const PostsDAO = require("../DAO/assistances.dao");
const pdao = new PostsDAO();

router.get("/:user_id/:event_id", async (req, res, next) => {  //Consultar todos los posts
    let json = await pdao.getAssistances(req.params.user_id, req.params.event_id)

    if(json.error) {
        res.status(400).json(json);
    } else{
        res.json(json);
    }

    //res.json(await pdao.getAssistances(req.params.user_id, req.params.event_id));


})

router.post("/:user_id/:event_id", async (req, res, next) => {  //Consultar todos los posts
    res.json(await pdao.postAssistances(req.params.user_id, req.params.event_id));
})

router.put("/:user_id/:event_id", async (req, res, next) => {  //Consultar todos los posts
    let json = await pdao.putAssistances(req.params.user_id, req.params.event_id,req.body)
    if(json.error){
        res.status(400).json(json);
    }else{
        res.status(200).json(json);
    }
})

router.delete("/:user_id/:event_id", async (req, res, next) => {  //Consultar todos los posts
    res.json(await pdao.deleteAssistances());
})

module.exports = router;