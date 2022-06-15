
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tabla = 'users';

class UsersDAO {

    async login(body) {
        if(body.email === undefined || body.password === undefined){
            return {
                error: "Missing parameters"
            }
        } else {
            const { email, password } = body;
            const bcrypt = require("bcrypt");
            const [user] = await global.connection.promise().query(`SELECT * FROM users WHERE email = "${email}"`);
            if(user.length === 0){
                return {
                    error: "User not found."
                }
            } else {
                // si no existe el usuario
                if (!user) return { error: "User not found." };

                // si la contraseña no es correcta
                if (!bcrypt.compareSync(password, user[0].password)) return { error: "Incorrect Username or Password." }

                const jwt = require('jsonwebtoken');
                const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_KEY/*, { expiresIn: "12h" }*/)
                console.log("Successfully logged user: ", token);

                return token;
            }
        }

    }

    async post(user) {
        const [results] = await global.connection.promise().query(`INSERT INTO ${tabla} (??) values (\"${user.name}\", \"${user.last_name}\", \"${user.email}\", \"${user.password}\", \"${user.image}\")`, [["name", "last_name", "email", "password", "image"]]);
        const [user_query] = await global.connection.promise().query(`SELECT name, last_name, email, image FROM ${tabla} WHERE id = ${results.insertId}`);
        return user_query;
    }


    async getAll() {
        const [results] = await global.connection.promise().query("SELECT id, name, last_name, email, image FROM ??", [tabla])
        if (results.length === 0) {
            return { error: "No users found." }
        } else {
            return results;
        }
    }

    async getUsersId(id) {
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE id = ${id}`, [tabla])
        if (results.length === 0) {
            return {
                error: "User with id " + id + " not found."
            }
        } else {
            results[0].password = undefined;
            return results;
        }
    }

    async getUsersSearch(search) {
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE name LIKE '%${search}%' OR last_name LIKE '%${search}%' OR email LIKE '%${search}%'`, [tabla])
        if (results.length === 0) {
            return {
                error: "No user with name, last_name or email with: " + search
            }
        } else {
            return results[0];
        }
    }
    async update(id, body) {
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
                error: "No field found to update"
            }
        } else {
            const [results] = await global.connection.promise().query(`SELECT * FROM ${tabla} WHERE id = ${id}`);
            return results[0];
        }

    }

    async delete(id, requested_id) {
        if(requested_id == id){
            const [results] = await global.connection.promise().query(`DELETE FROM ${tabla} WHERE id = ${id}`);
            return results;
        } else {
            return {
                error: "You cannot delete another user other than yourself."
            }
        }
    }

    async getUserEvents(id) {
        const [results] = await global.connection.promise().query(`SELECT * FROM events WHERE owner_id = ${id}`)
        if (results.length === 0) {
            return {
                error: "No user-created event with id: " + id
            }
        }
        else{
            return results;
        }
    }

    async getUserFutureEvents(id) {

        let filteredEvents = [];
        const [results] = await global.connection.promise().query(`SELECT * FROM events WHERE owner_id = ${id}`)
        
        if (results.length === 0) {
            return {
                error: "No user-created event with id: " + id
            }
        } else {
            let e;
            for (e of results) {

                let date = new Date(e.eventStart_date);
                if (date > new Date()) {
                    filteredEvents.push(e);
                }
            }
            return filteredEvents;
        }
    }
    async getUserPastEvents(id) {

        let filteredEvents = [];
        const [results] = await global.connection.promise().query(`SELECT * FROM events WHERE owner_id = ${id}`)
        if (results.length === 0) {
            return {
                error: "No user-created event with id: " + id
            }
        } else {
            let e;
            for (e of results) {
                let date = new Date(e.eventEnd_date);
                if (date < new Date()) {
                    filteredEvents.push(e);
                }
            }
            console.log(filteredEvents);
            return filteredEvents;
        }
    }

    async getUserCurrentEvents(id) {

        let filteredEvents = [];
        const [results] = await global.connection.promise().query(`SELECT * FROM events WHERE owner_id = ${id}`)
        if (results.length === 0) {
            return {
                error: "No user-created event with id found: " + id
            }
        } else {
            let e;
            for (e of results) {
                let date = new Date(e.eventStart_date);
                if (date < new Date() && date > new Date()) {
                    filteredEvents.push(e);
                }
            }
            return filteredEvents;
        }
    }

    async getUserAssistances(id) {

        let filteredEvents = [];
        const [assistances] =  await global.connection.promise().query(`SELECT * FROM assistance WHERE user_id = ${id}`);
        const [events] =  await global.connection.promise().query(`SELECT * FROM events`);
        
        if (assistances.length === 0 || events.length === 0) {
            return {
                error: "No user-created event with id: " + id
            }
        } else {
            let e;
            for (e of events) {
                let a;
                for (a of assistances) {
                    if (e.id === a.event_id) {
                        filteredEvents.push(e);
                    }
                }
            }
            return filteredEvents;
        }
    }

    async getUserAssistancesFuture(id) {

        let filteredEvents = [];
        const [assistances] =  await global.connection.promise().query(`SELECT * FROM assistance WHERE user_id = ${id}`);
        const [events] =  await global.connection.promise().query(`SELECT * FROM events`);
        
        if (assistances.length === 0 || events.length === 0) {
            return {
                error: "No user-created event with id: " + id
            }
        } else {
            let e;
            for (e of events) {
                let a;
                for (a of assistances) {
                    if (e.id === a.event_id) {
                        let date = new Date(e.eventStart_date);
                        if(date > new Date()){
                            filteredEvents.push(e);
                        }
                    }
                }
            }

            if(filteredEvents.length === 0){
                return {
                    error: "You don't have any future user-assisted events with the id: " + id
                }
            } else {
                return filteredEvents;
            }
        }
    }

    async getUserAssistancesPast(id) {

        let filteredEvents = [];
        const [assistances] =  await global.connection.promise().query(`SELECT * FROM assistance WHERE user_id = ${id}`);
        const [events] =  await global.connection.promise().query(`SELECT * FROM events`);
        
        if (assistances.length === 0 || events.length === 0) {
            return {
                error: "No user-created event with id: " + id
            }
        } else {
            let e;
            for (e of events) {
                let a;
                for (a of assistances) {
                    if (e.id === a.event_id) {
                        let date = new Date(e.eventStart_date);
                        if(date < new Date()){
                            filteredEvents.push(e);
                        }
                    }
                }
            }

            if(filteredEvents.length === 0) {
                return {
                    error: "You don't have any past user-assisted events with the id: " + id
                }
            } else {
                return filteredEvents;
            }
        }
    }

    async getUserFriends(id) {

        let filteredFriends = [];
        let f;
        const [users] =  await global.connection.promise().query(`SELECT * FROM users`);
        const [friends] =  await global.connection.promise().query(`SELECT * FROM friends WHERE user_id = ${id} OR user_id_friend = ${id}`);
        
        for (f of friends) {
            let u;
            for (u of users) {

                if ((f.user_id_friend === u.id) && f.status === 1 ) {
                    if(u.id != id){
                        filteredFriends.push(u);
                    }
                }

                if ((f.user_id === u.id) && f.status === 1) {
                    if(u.id != id){
                        filteredFriends.push(u);
                    }
                }
            }
        }

        if(filteredFriends.length === 0) {
            return {
                error: "It's sad, but I haven't found friends"
            }
        } else {
            return filteredFriends;
        }
    }

    async getUserStatistics(id) {
        
        const [assistances_all] =  await global.connection.promise().query(`SELECT * FROM assistance`);
        const [assistances] =  await global.connection.promise().query(`SELECT * FROM assistance WHERE user_id = ${id}`);

        if(assistances.length === 0){
            return {
                error: "No assists created by user with id: " + id
            }
        } else {

            let avg_score = 0;
            let total_score;
            let numbers = 0;

            for (let a of assistances) {
                if(a.puntuation != null){
                    avg_score += a.puntuation;
                    numbers++;
                }
            }

            total_score = avg_score/numbers;
            let num_comments = 0;

            for (let a of assistances) {
                if(a.comentary != null){
                    num_comments++;
                }
            }

            let percent = 0;
            let num_comments_all = 0;

            for (let a of assistances_all) {
                if(a.comentary != null){
                    num_comments_all++;
                }
            }

            percent = (num_comments/num_comments_all)*100;

            return {
                "avg_score": total_score,
                "num_comments": num_comments,
                "percentage_commenters_below": percent
            }
        }
    }
}

module.exports = UsersDAO