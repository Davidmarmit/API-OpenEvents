
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tabla = 'users';

class UsersDAO {

    async login(body) {

        const { email, password } = body;
        const bcrypt = require("bcrypt");
        const [user] = await global.connection.promise().query(`SELECT * FROM users WHERE email = "${email}"`);

        // si no existe el usuario
        if (!user) return next("user not found")

        // si la contraseña no es correcta
        if (!bcrypt.compareSync(password, user[0].password)) return next("wrong password")

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_KEY/*, { expiresIn: "12h" }*/)
        console.log("Usuario logeado correctamente: ", token);

        return token;
    }

    async post(user) {
        // INSERT INTO ?? (??) values (??)
        try {
            const [results] = global.connection.promise().query(`INSERT INTO ${tabla} (??) values (\"${user.name}\", \"${user.last_name}\", \"${user.email}\", \"${user.password}\", \"${user.image}\")`, [["name", "last_name", "email", "password", "image"]]);
            return results;
        } catch (error) {
            return error;
        }
    }


    async getAll() {
        // SELECT * FROM tabla
        const [results] = await global.connection.promise().query("SELECT * FROM ??", [tabla])
        results[0].password = undefined;
        return results;
    }

    async getUsersId(id) {
        // SELECT * FROM ?? WHERE id = 'params.id'
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE id = ${id}`, [tabla])
        if (results.length === 0) {
            return {
                error: "No se encontró el usuario con el id: " + id
            }
        }else{
            results[0].password = undefined;
            return results;
        }
    }

    async getUsersSearch(search) {
        // SELECT * FROM ?? WHERE name LIKE '%params.search%'
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE name LIKE '%${search}%'`, [tabla])
        if (results.length === 0) {
            return {
                error: "No se encontró ningun usuario con nombre, last_name o email con : " + search
            }
        }else{
            return results[0];
        }
    }
    async update(id, body) {
        // UPDATE tabla SET ?? = ?? WHERE id = 'params.id'
        if(body.name !== undefined){
            const [results] = await global.connection.promise().query(`UPDATE ${tabla} SET name = \"${body.name}\" WHERE id = ${id}`);
        }
        if(body.last_name !== undefined){
            const [results] = await global.connection.promise().query(`UPDATE ${tabla} SET last_name = \"${body.last_name}\" WHERE id = ${id}`);
        }
        if(body.email !== undefined){
            const [results] = await global.connection.promise().query(`UPDATE ${tabla} SET email = \"${body.email}\" WHERE id = ${id}`);
        }
        if(body.password !== undefined){
            const [results] = await global.connection.promise().query(`UPDATE ${tabla} SET password = \"${body.password}\" WHERE id = ${id}`);
        }
        if(body.image !== undefined){
            const [results] = await global.connection.promise().query(`UPDATE ${tabla} SET image = \"${body.image}\" WHERE id = ${id}`);
        }
        if(body.name === undefined && body.last_name === undefined && body.email === undefined && body.password === undefined && body.image === undefined){
            return {
                error: "No se encontró ningun campo para actualizar"
            }
        }else{
            const [results] = await global.connection.promise().query(`SELECT * FROM ${tabla} WHERE id = ${id}`);
            return results[0];
        }

    }
    //TODO verificar que se borre el token
    async delete(id, requested_id) {
        // DELETE FROM tabla WHERE id = 'params.id'
        if(requested_id === id){
            const [results] = await global.connection.promise().query(`DELETE FROM ${tabla} WHERE id = ${id}`);
            return results;
        }
        else{
            return {
                error: "No puedes borrar otro usuario que no seas tu."
            }
        }
    }

    async getUserEvents(id) {
        // SELECT * FROM ?? WHERE id = 'params.id'
        const [results] = await global.connection.promise().query(`SELECT * FROM events WHERE owner_id = ${id}`)
        if (results.length === 0) {
            return {
                error: "No se encontró ningun evento creado por el usuario con el id: " + id
            }
        }
        else{
            return results;
        }
    }

    async getUserFutureEvents(id) {
        // SELECT * FROM ?? WHERE id = 'params.id'
        let filteredEvents = [];
        const [results] = await global.connection.promise().query(`SELECT * FROM events WHERE owner_id = ${id}`)
        if (results.length === 0) {
            return {
                error: "No se encontró ningun evento creado por el usuario con el id: " + id
            }
        }
        else{
            let e;
            for (e of results) {
                let date = new Date(e.eventStart_date);
                console.log(date);
                if (date > new Date()) {
                    console.log(e.name + "Es futuro");
                    filteredEvents.push(e);
                }
            }
            console.log(filteredEvents);
            return filteredEvents;
        }
    }
    async getUserPastEvents(id) {
        // SELECT * FROM ?? WHERE id = 'params.id'
        let filteredEvents = [];
        const [results] = await global.connection.promise().query(`SELECT * FROM events WHERE owner_id = ${id}`)
        if (results.length === 0) {
            return {
                error: "No se encontró ningun evento creado por el usuario con el id: " + id
            }
        }
        else{
            let e;
            for (e of results) {
                let date = new Date(e.eventEnd_date);
                console.log(date);
                if (date < new Date()) {
                    console.log(e.name + "Es pasado");
                    filteredEvents.push(e);
                }
            }
            console.log(filteredEvents);
            return filteredEvents;
        }
    }
    async getUserCurrentEvents(id) {
        // SELECT * FROM ?? WHERE id = 'params.id'
        let filteredEvents = [];
        const [results] = await global.connection.promise().query(`SELECT * FROM events WHERE owner_id = ${id}`)
        if (results.length === 0) {
            return {
                error: "No se encontró ningun evento creado por el usuario con el id: " + id
            }
        }
        else{
            let e;
            for (e of results) {
                let date = new Date(e.eventStart_date);
                console.log(date);
                if (date < new Date() && date > new Date()) {
                    console.log(e.name + "Es actual");
                    filteredEvents.push(e);
                }
            }
            console.log(filteredEvents);
            return filteredEvents;
        }
    }

    async getUserAssistances(id) {
        // SELECT * FROM ?? WHERE id = 'params.id'
        let filteredEvents = [];
        const [assistances] =  await global.connection.promise().query(`SELECT * FROM assistance WHERE user_id = ${id}`);
        console.log(assistances);
        const [events] =  await global.connection.promise().query(`SELECT * FROM events`);
        if (assistances.length === 0 || events.length === 0) {
            return {
                error: "No se encontró ningun evento creado por el usuario con el id: " + id
            }
        }
        else{
            let e;
            for (e of events) {
                let a;
                for (a of assistances) {
                    console.log("Event id: " + e.id + " =?= " + a.event_id + " :Event_id Assistance");
                    if (e.id === a.event_id) {
                        console.log("Asistes a " + e.name);
                        filteredEvents.push(e);
                    }
                }
            }
            console.log(filteredEvents);
            return filteredEvents;
        }
    }

    async getUserAssistancesFuture(id) {
        // SELECT * FROM ?? WHERE id = 'params.id'
        let filteredEvents = [];
        const [assistances] =  await global.connection.promise().query(`SELECT * FROM assistance WHERE user_id = ${id}`);
        console.log(assistances);
        const [events] =  await global.connection.promise().query(`SELECT * FROM events`);
        if (assistances.length === 0 || events.length === 0) {
            return {
                error: "No se encontró ningun evento creado por el usuario con el id: " + id
            }
        }
        else{
            let e;
            for (e of events) {
                let a;
                for (a of assistances) {
                    console.log("Event id: " + e.id + " =?= " + a.event_id + " :Event_id Assistance");
                    if (e.id === a.event_id) {
                        let date = new Date(e.eventStart_date);
                        if(date > new Date()){
                            console.log("Assistaras a " + e.name);
                            filteredEvents.push(e);
                        }
                    }
                }
            }
            console.log(filteredEvents);
            if(filteredEvents.length === 0){
                return {
                    error: "No tienes ningun evento futuro asistido por el usuario con el id: " + id
                }
            }else{
                return filteredEvents;
            }
        }
    }

    async getUserAssistancesPast(id) {
        let filteredEvents = [];
        const [assistances] =  await global.connection.promise().query(`SELECT * FROM assistance WHERE user_id = ${id}`);
        console.log(assistances);
        const [events] =  await global.connection.promise().query(`SELECT * FROM events`);
        if (assistances.length === 0 || events.length === 0) {
            return {
                error: "No se encontró ningun evento creado por el usuario con el id: " + id
            }
        }
        else{
            let e;
            for (e of events) {
                let a;
                for (a of assistances) {
                    console.log("Event id: " + e.id + " =?= " + a.event_id + " :Event_id Assistance");
                    if (e.id === a.event_id) {
                        let date = new Date(e.eventStart_date);
                        if(date < new Date()){
                            console.log("Asististe a " + e.name);
                            filteredEvents.push(e);
                        }
                    }
                }
            }
            console.log(filteredEvents);
            if(filteredEvents.length === 0){
                return {
                    error: "No tienes ningun evento pasado asistido por el usuario con el id: " + id
                }
            }else{
                return filteredEvents;
            }
        }
    }
}

module.exports = UsersDAO