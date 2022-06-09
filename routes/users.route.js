const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const UsersDAO = require("../DAO/users.dao");
const bcrypt = require("bcrypt");
const udao = new UsersDAO();


router.post("/login", async (req, res, next) => {  //Login de usuario
    res.json({"accessToken" : await udao.login(req.body, next)});
})

router.get("/search", privateRoute, async (req, res) => {  //Consultar un usuario, solo usuario autenticado
    let json = await udao.getUsersSearch(req.query.s);
    if(json.error){
        res.status(400).json(json);
    }
    else{
        res.status(200).json(json);
    }

})

router.post("/", async (req, res, next) => {  //Añadir un usuario, encriptando la password

    let password = req.body.password

    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const myPlaintextPassword = password;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(myPlaintextPassword, salt);
    req.body.password = hash
    try {
        res.json(await udao.post(req.body))
    } catch (error) {
        next (error)
    }
})

router.get("/:id" , privateRoute, async (req, res) => {  //Consultar un usuario, solo usuario autenticado
    let json = await udao.getUsersId(req.params.id);
    if(json.error){
        res.status(400).json(json);
    }
    else{
        res.status(200).json(json);
    }
})

router.get("/" , privateRoute, async (req, res) => {  //Consultar todos los usuarios, solo usuario autenticado
    let json = await udao.getAll()
    if(json.error){
        res.status(400).json(json);
    }
    else{
        res.status(200).json(json);
    }
})

router.put("/", privateRoute, async (req, res) => {  //Editar un usuario, solo el usuario mismo

    if(req.body.password) {
        let password = req.body.password

        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const myPlaintextPassword = password;

        const salt = bcrypt.genSaltSync(saltRounds);
        req.body.password = bcrypt.hashSync(myPlaintextPassword, salt)
    }
    let json = await udao.update(req.USER_ID, req.body)
    if(json.error){
        res.status(400).json(json);
    }
    else{
        res.status(200).json(json);
    }
})

//TODO acabar stats, coger datos de todas las asistencias, mirar que no sean undefine o null, y calcular la media de puntuation,
router.get("/:id/statistics", privateRoute, async (req, res) => {
    let json = await udao.getUserStatistics(req.params.id)
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.status(200).json(json);
    }
})

router.delete("/:id", privateRoute, async (req, res) => {  //Eliminar un usuario, solo el usuario mismo
    let json = await udao.delete(req.USER_ID, req.params.id)
    if (json.error) {
        res.status(400).json(json);
    } else {
        res.status(200).json(json);
    }
})
router.get("/:id/events", privateRoute, async (req, res) => {
    let json = await udao.getUserEvents(req.params.id)
    if (json.error) {
        res.status(400).json(json);
    }
    else {
        res.status(200).json(json);
    }
})

router.get("/:id/events/future", privateRoute, async (req, res) => {
    let json = await udao.getUserFutureEvents(req.params.id)
    if (json.error) {
        res.status(400).json(json);
    }
    else {
        res.status(200).json(json);
    }
})

router.get("/:id/events/finished", privateRoute, async (req, res) => {
    let json = await udao.getUserPastEvents(req.params.id)
    if (json.error) {
        res.status(400).json(json);
    }
    else {
        res.status(200).json(json);
    }
})

router.get("/:id/events/current", privateRoute, async (req, res) => {
    let json = await udao.getUserCurrentEvents(req.params.id)
    if (json.error) {
        res.status(400).json(json);
    }
    else {
        res.status(200).json(json);
    }
})

router.get("/:id/assistances", privateRoute, async (req, res) => {
    let json = await udao.getUserAssistances(req.params.id)
    if (json.error) {
        res.status(400).json(json);
    }
    else {
        res.status(200).json(json);
    }
})

router.get("/:id/assistances/future", privateRoute, async (req, res) => {
    let json = await udao.getUserAssistancesFuture(req.params.id)
    if (json.error) {
        res.status(400).json(json);
    }
    else {
        res.status(200).json(json);
    }
})

router.get("/:id/assistances/finished", privateRoute, async (req, res) => {
    let json = await udao.getUserAssistancesPast(req.params.id)
    if (json.error) {
        res.status(400).json(json);
    }
    else {
        res.status(200).json(json);
    }
})

router.get("/:id/friends", privateRoute, async (req, res) => {
    let json = await udao.getUserFriends(req.params.id)
    if (json.error) {
        res.status(400).json(json);
    }
    else {
        res.status(200).json(json);
    }
})



router.get
module.exports = router;