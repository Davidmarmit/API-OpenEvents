require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const helmet = require("helmet");

const mysql = require("mysql2");
global.connection = mysql.createConnection(process.env.DATABASE_URL);

const app = express();
const port = 3000;

const usersRoute = require('./routes/users.route');
const eventsRoute = require('./routes/events.route');
const messagesRoute = require('./routes/messages.route');
const friendsRoute = require('./routes/friends.route');
const assistances = require('./routes/assistances.route');

app.use(morgan('tiny'));
app.use(helmet());

app.use(express.json());

app.use("/users" , usersRoute);
app.use("/events" , eventsRoute);
app.use("/messages" , messagesRoute);
app.use("/friends" , friendsRoute);
app.use("/assistances" , assistances);

app.post('/login', async (req, res, next) => {  //Autenticar un usuario

    const { email, password } = req.body;
    const bcrypt = require("bcrypt");
    const [user] = await global.connection.promise().query(`SELECT * FROM user WHERE email = "${email}"`);

    // si no existe el usuario
    if (!user) return next("user not found")

    // si la contraseña no es correcta
    if (!bcrypt.compareSync(password, user[0].password)) return next("wrong password")

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY); 

    console.log("Usuario logeado correctamente: ", token);
  
    res.json({ accessToken: token });

})

app.get('*', (req, res) => {
    res.json({ error: "404"});
})

app.use((err, req, res, next) => {
    switch (err) {
        case "user not found":
            console.log(err)
            res.status(404).json({ error: "el usuario y el password son incorrectos" })
            break;
        case "wrong password":
            console.log(err)
            res.status(404).json({ error: "el usuario y el password son incorrectos" })
            break;
        case "401":
            console.log(err)
            res.status(401).json({ error: "no tienes permisos" })
            break;
        case "eres tu":
            res.status(401).json({ error: "eres tu" })
            break;
      default:
        res.status(500).json({ error: err })
        break;
    }
})


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})