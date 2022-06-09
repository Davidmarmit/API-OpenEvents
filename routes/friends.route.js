const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const FriendsDAO = require("../DAO/friends.dao");
const fdao = new FriendsDAO();

router.get("/requests", privateRoute, async (req, res, next) => {  //Consultar todos los request de friends
    
    const id = req.USER_ID;
    json = await fdao.getFriendsRequest(id);

    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.get("/", privateRoute, async (req, res, next) => {  //Consultar todos los friends
    
    const id = req.USER_ID;
    json = await fdao.getFriends(id);
    
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.post("/:id", privateRoute, async (req, res, next) => {  //Enviar friend request a alguien
    
    const owner_id = req.USER_ID;
    json = await fdao.postFriends(owner_id, req.params.id);
    
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.put("/:id", privateRoute, async (req, res, next) => {  //Aceptar friend requests
    
    const owner_id = req.USER_ID;
    json = await fdao.putFriends(owner_id, req.params.id);
    
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

router.delete("/:id", privateRoute, async (req, res, next) => {  //Eliminar friend requests
    
    const owner_id = req.USER_ID;
    json = await fdao.deleteFriends(owner_id, req.params.id);
    
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.json(json);
    }
})

module.exports = router;