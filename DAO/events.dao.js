const tabla = 'events';
const res = require('express/lib/response');
const moment = require('moment');

class EventsDAO {

    async postEvent (event, owner_id) {  //añadir un nuevo event

        try {

            const add = await global.connection.promise().query(`INSERT INTO ?? (name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, type) VALUES ("${event.name}", ${owner_id}, "${moment().format()}", "${event.image}", "${event.location}", "${event.description}", "${event.eventStart_date}", "${event.eventEnd_date}", ${event.n_participators}, "${event.type}")`, [tabla]);
            const results = await global.connection.promise().query(`SELECT name, image, location, description, eventStart_date, eventEnd_date, n_participators, type, owner_id, date FROM ?? WHERE id = "${add[0].insertId}"`, [tabla]);
            return results[0];
        
        } catch (error) {
            return { error: "Missing required parameters." };
        }
    }

    async getEvents () {
                
        const results = await global.connection.promise().query(`SELECT id, name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, slug, type FROM ?? WHERE eventStart_date > "${moment().format()}"`, [tabla]);

        if (results[0].length === 0) {
            return { error: "Any events found." };
        } else {
            return results[0];
        }
    }

    async getEventsId (id) {
                
        const results = await global.connection.promise().query(`SELECT id, name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, slug, type FROM ?? WHERE id = ${id}`, [tabla]);

        if (results[0].length === 0) {
            return { error: "Not event found." };
        } else {
            return results[0];
        }
        
    }

    async getEventsBest (id) {  //currently not implemented
                
        const events_number =  await global.connection.promise().query(`SELECT COUNT(id) FROM assistance WHERE user_id = ${id}`, [tabla]);
        const results = [];

        for (let i = 0; i < events_number[0].length; i++) {

            let event = await global.connection.promise().query(`SELECT id, name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, slug, type FROM ?? WHERE id = ${id}`, [tabla]);
            const average = await global.connection.promise().query(`SELECT AVG(puntuation) FROM assistance WHERE user_id = ${id}`, [tabla]);
            event.avg_score = average;

            results.push(event);

        }

        if (results.length === 0) {
            return { error: "Not events found." };
        } else {
            return results;
        }
    }

    async getEventsSearch (location, keyword, date) {

        if (location !== undefined && keyword !== undefined && date !== undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%' OR name LIKE '%${keyword}%' OR date LIKE '%${date}%'`, [tabla]);
        }

        if (location === undefined && keyword !== undefined && date !== undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE  name LIKE '%${keyword}%' OR date LIKE '%${date}%'`, [tabla]);
        }

        if (location !== undefined && keyword === undefined && date !== undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%' OR date LIKE '%${date}%'`, [tabla]);
        }

        if (location !== undefined && keyword !== undefined && date === undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%' OR name LIKE '%${keyword}%'`, [tabla]);
        }

        if (location === undefined && keyword === undefined && date !== undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE date LIKE '%${date}%'`, [tabla]);
        }

        if (location !== undefined && keyword === undefined && date === undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%'`, [tabla]);
        }

        if (location === undefined && keyword !== undefined && date === undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE name LIKE '%${keyword}%'`, [tabla]);
        }

        if (results.length === 0 || location === undefined && keyword === undefined && date === undefined) {

            return { error: "Not events found." };

        } else {
            return results;
        }

    }

    async putEventsEdit (id, body) {

        try {
                
            const add = await global.connection.promise().query(`UPDATE ?? SET name = "${body.name}", image = "${body.image}", location = "${body.location}", description = "${body.description}", eventStart_date = "${body.eventStart_date}", eventEnd_date = "${body.eventEnd_date}", n_participators = ${body.n_participators}, type = "${body.type}" WHERE id = ${id}`, [tabla]);
            const results = await global.connection.promise().query(`SELECT name, image, location, description, eventStart_date, eventEnd_date, n_participators, type, owner_id, date, slug FROM ?? WHERE id = ${id}`, [tabla]);
            return results[0];

        } catch (error) {
            return { error: "Missing required parameters." };
        }

    }

    async deleteEvents (id) {

        try {
                
            const borrar = await global.connection.promise().query(`DELETE FROM ?? WHERE id = ${id}`, [tabla]);
            const results = {"Mensaje": `${id} ha sido eliminado`};
            return results;

        } catch (error) {
            return { error: "Incorrect parameter." };
        }

    }

    async getEventsAssistancesId (id) {

                
        const results = await global.connection.promise().query(`SELECT users.id, users.name, users.last_name, users.email, users.image, assistance.puntuation, assistance.comentary FROM users INNER JOIN assistance ON users.id = assistance.user_id WHERE assistance.event_id= ${id}`, [tabla]);

        if (results[0].length === 0) {
            return { error: "Not assistance found." };
        } else {
            return results;
        }
    }

    async getEventsAssistancesUserId (event_id, user_id) {

                
        const results = await global.connection.promise().query(`SELECT users.id, users.name, users.last_name, users.email, users.image, assistance.puntuation, assistance.comentary FROM users INNER JOIN assistance ON users.id = assistance.user_id WHERE users.id = ${user_id} AND assistance.event_id = ${event_id}`);

        if (results.length === 0) {
            return { error: "Not assistance found." };
        } else {
            return results[0];
        }

    }

    async postEventsAssistancesId (event_id, user_id) {

        try {
                
            const results = await global.connection.promise().query(`INSERT INTO assistance (user_id, event_id) VALUES (${event_id}, ${user_id})`);
            return results[0];

        } catch (error) {
            return { error: "Missing required parameters." };
        }
    }

    async putEventsAssistancesId (event_id, user_id, puntuation, comentary) {

        try {
               
            if (puntuation !== undefined && comentary !== undefined) {
                const results = await global.connection.promise().query(`UPDATE assistance SET puntuation = ${puntuation}, comentary = "${comentary}" WHERE user_id = ${user_id} AND event_id = ${event_id}`);
                return results[0];
            }

            if (puntuation !== undefined && comentary === undefined) {
                const results = await global.connection.promise().query(`UPDATE assistance SET puntuation = ? WHERE user_id = ${user_id} AND event_id = ${event_id}`);
                return results[0];
            }

            if (puntuation === undefined && comentary !== undefined) {
                const results = await global.connection.promise().query(`UPDATE assistance SET comentary = "${comentary}" WHERE user_id = ${user_id} AND event_id = ${event_id}`);
                return results[0];
            }

            if (puntuation === undefined && comentary === undefined) {
                return { error: "Missing required parameters." };
            }

        } catch (error) {
            return { error: "Missing required parameters." };
        }
    }

    async deleteEventsAssistancesId (event_id, user_id) {

        try {
                
            const results = await global.connection.promise().query(`DELETE FROM assistance WHERE user_id = ${user_id} AND event_id = ${event_id}`);
            return results[0];

        } catch (error) {
            return { error: "Missing required parameters." };
        }
    }
}

module.exports = EventsDAO