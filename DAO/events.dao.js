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
            return res.json({ error: error });
        }
    }

    async getEvents () {

        try {
                
            const results = await global.connection.promise().query(`SELECT id, name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, slug, type FROM ?? WHERE eventStart_date > "${moment().format()}"`, [tabla]);
            return results[0];

        } catch (error) {
            return res.json({ error: error });
        }
    }

    async getEventsId (id) {

        try {
                
            const results = await global.connection.promise().query(`SELECT id, name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, slug, type FROM ?? WHERE id = ${id}`, [tabla]);
            return results[0];

        } catch (error) {
            return res.json({ error: error });
        }
    }

    async getEventsBest (id) {  //currently not implemented

        console.log(id) 

        try {
                
            const events_number =  await global.connection.promise().query(`SELECT COUNT(id) FROM assistance WHERE user_id = ${id}`, [tabla]);

            const results = [];

            for (let i = 0; i < events_number[0].length; i++) {

                let event = await global.connection.promise().query(`SELECT id, name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, slug, type FROM ?? WHERE id = ${id}`, [tabla]);
                const average = await global.connection.promise().query(`SELECT AVG(puntuation) FROM assistance WHERE user_id = ${id}`, [tabla]);
                event.avg_score = average;

                results.push(event);

            }

            return results;

        } catch (error) {
            return res.json({ error: error });
        }
    }

    async getEventsSearch (location, keyword, date) {

        if (location != undefined && keyword != undefined && date != undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%' OR name LIKE '%${keyword}%' OR date LIKE '%${date}%'`, [tabla]);
        }

        if (location == undefined && keyword != undefined && date != undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE  name LIKE '%${keyword}%' OR date LIKE '%${date}%'`, [tabla]);
        }

        if (location != undefined && keyword == undefined && date != undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%' OR date LIKE '%${date}%'`, [tabla]);
        }

        if (location != undefined && keyword != undefined && date == undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%' OR name LIKE '%${keyword}%'`, [tabla]);
        }

        if (location == undefined && keyword == undefined && date != undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE date LIKE '%${date}%'`, [tabla]);
        }

        if (location != undefined && keyword == undefined && date == undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE '%${location}%'`, [tabla]);
        }

        if (location == undefined && keyword != undefined && date == undefined) {
            const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE location LIKE name LIKE '%${keyword}%'`, [tabla]);
        }

        if (results.length === 0 || location == undefined && keyword == undefined && date == undefined) {

            return res.json({ error: error });

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
            return res.json({ error: error });
        }

    }

    async deleteEvents (id) {

        try {
                
            const borrar = await global.connection.promise().query(`DELETE FROM ?? WHERE id = ${id}`, [tabla]);
            const results = {"Mensaje": `${id} ha sido eliminado`};
            return results;

        } catch (error) {
            return res.json({ error: error });
        }

    }

    async getEventsAssistancesId (id) {

        try {
                
            const results = await global.connection.promise().query(`SELECT user_id as id, user.name, user.last_name, user.email, assitance.puntuation, assitance.comentary FROM assitance, user  WHERE event_id = ${id} AND user.user_id = ${id}` , [tabla]);
            return results;

        } catch (error) {
            return res.json({ error: error });
        }

    }
    
    

}

module.exports = EventsDAO