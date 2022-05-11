const express = require("express");
const router = express.Router();
const privateRoute = require("../Middleware/private.mid");

const UsersDAO = require("../DAO/users.dao");
const udao = new UsersDAO();

router.get("/", privateRoute, async (req, res, next) => {  //Consultar todos los usuarios, solo usuario autenticado
    res.json(await udao.getAll());
})

router.post("/login", async (req, res, next) => {  //Login de usuario
    res.json({"accessToken" : await udao.login(req.body, next)});
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
    } catch (err) {
        next (err)
    }
})

router.put("/:id", privateRoute, async (req, res, next) => {  //Editar un usuario, solo el usuario mismo
    if (req.USER_ID == req.params.id) return next("eres tu")
    res.json(await udao.update(req.params.id, req.body));
})

module.exports = router;