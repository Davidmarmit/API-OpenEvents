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

app.get('*', (req, res) => {
    res.status(404).json({ error: "Route not found."});
})

app.use((err, req, res, next) => {
    switch (err) {
        case "user not found":
            console.log(err)
            res.status(404).json({ error: "The username and password are incorrect." })
            break;
        case "wrong password":
            console.log(err)
            res.status(404).json({ error: "The username and password are incorrect." })
            break;
      default:
        res.status(500).json({ error: err })
        break;
    }
})


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})