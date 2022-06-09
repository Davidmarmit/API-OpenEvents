const tabla = 'events';
const res = require('express/lib/response');
const moment = require('moment');

class EventsDAO {

    async postEvent (event, owner_id) { 

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
            return { error: "No event found." };
        } else {
            return results[0];
        }
        
    }

    async getEventsBest () {
        
        const results = await global.connection.promise().query(`SELECT events.id, events.name, events.owner_id, events.date, events.image, events.location, events.description, events.eventStart_date, events.eventEnd_date, events.n_participators, events.slug, events.type, assistance.puntuation AS avg_score FROM events INNER JOIN assistance ON events.id = assistance.event_id`);

        if (results[0].length === 0) {
            return { error: "No events found." };
        } else {
            return results[0];
        }
    }

    async getEventsSearch (location, keyword, date) {

        var results = [];

        if (location !== undefined && keyword !== undefined && date !== undefined) {
            results = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%' OR name LIKE '%${keyword}%' OR date LIKE '%${date}%'`, [tabla]);
        }

        if (location === undefined && keyword !== undefined && date !== undefined) {
            results = await global.connection.promise().query(`SELECT * FROM ?? WHERE  name LIKE '%${keyword}%' OR date LIKE '%${date}%'`, [tabla]);
        }

        if (location !== undefined && keyword === undefined && date !== undefined) {
            results = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%' OR date LIKE '%${date}%'`, [tabla]);
        }

        if (location !== undefined && keyword !== undefined && date === undefined) {
            results = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%' OR name LIKE '%${keyword}%'`, [tabla]);
        }

        if (location === undefined && keyword === undefined && date !== undefined) {
            results = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE date LIKE '%${date}%'`, [tabla]);
        }

        if (location !== undefined && keyword === undefined && date === undefined) {
            results = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%'`, [tabla]);
        }

        if (location === undefined && keyword !== undefined && date === undefined) {
            results = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE name LIKE '%${keyword}%'`, [tabla]);
        }

        if (results[0].length === 0 || location === undefined && keyword === undefined && date === undefined) {

            return { error: "No events found." };

        } else {
            return results[0];
        }

    }

    async putEventsEdit (id, body) {
        
        var add = []

        if (body.name !== undefined) {
            add = await global.connection.promise().query(`UPDATE ?? SET name = "${body.name}"WHERE id = ${id}`, [tabla]);
        }
        
        if (body.image !== undefined) {
            add = await global.connection.promise().query(`UPDATE ?? SET image = "${body.image}"WHERE id = ${id}`, [tabla]);
        }

        if (body.location !== undefined) {
            add = await global.connection.promise().query(`UPDATE ?? SET location = "${body.location}" WHERE id = ${id}`, [tabla]);
        }

        if (body.description !== undefined) {
            add = await global.connection.promise().query(`UPDATE ?? SET description = "${body.description}" WHERE id = ${id}`, [tabla]);
        }

        if (body.eventStart_date !== undefined) {
            add = await global.connection.promise().query(`UPDATE ?? SET eventStart_date = "${body.eventStart_date}" WHERE id = ${id}`, [tabla]);
        }

        if (body.eventEnd_date !== undefined) {
            add = await global.connection.promise().query(`UPDATE ?? SET eventEnd_date = "${body.eventEnd_date}" WHERE id = ${id}`, [tabla]);
        }

        if (body.n_participators !== undefined) {
            add = await global.connection.promise().query(`UPDATE ?? SET n_participators = ${body.n_participators} WHERE id = ${id}`, [tabla]);
        }

        if (body.type !== undefined) {
            add = await global.connection.promise().query(`UPDATE ?? SET type = "${body.type}" WHERE id = ${id}`, [tabla]);
        }

        const results = await global.connection.promise().query(`SELECT name, image, location, description, eventStart_date, eventEnd_date, n_participators, type, owner_id, date, slug FROM ?? WHERE id = ${id}`, [tabla]);

        if (results[0].length === 0) {
            return { error: "No event found." };
        } else {
            return results[0];
        }
    }

    async deleteEvents (id) {
                
        const verify = await global.connection.promise().query(`SELECT id FROM ?? WHERE id = ${id}`, [tabla]);
        
        if (verify[0].length === 0) {
            return { error: "No event found." };
        } else {
            const borrar = await global.connection.promise().query(`DELETE FROM ?? WHERE id = ${id}`, [tabla]);
            const results = {"Mensaje": `${id} ha sido eliminado`};
            return results;
        }

    }

    async getEventsAssistancesId (id) {

        const results = await global.connection.promise().query(`SELECT users.id, users.name, users.last_name, users.email, users.image, assistance.puntuation, assistance.comentary FROM users INNER JOIN assistance ON users.id = assistance.user_id WHERE assistance.event_id= ${id}`, [tabla]);

        if (results[0].length === 0) {
            return { error: "No assistance found." };
        } else {
            return results[0];
        }
    }

    async getEventsAssistancesUserId (event_id, user_id) {
                
        const results = await global.connection.promise().query(`SELECT users.id, users.name, users.last_name, users.email, users.image, assistance.puntuation, assistance.comentary FROM users INNER JOIN assistance ON users.id = assistance.user_id WHERE users.id = ${user_id} AND assistance.event_id = ${event_id}`);

        if (results[0].length === 0) {
            return { error: "No assistance found." };
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