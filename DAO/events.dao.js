const tabla = 'events';
const moment = require('moment');

class EventsDAO {

    async postEvent (event, owner_id) {  //añadir un nuevo event

        try {

            const add = await global.connection.promise().query(`INSERT INTO ?? (name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, type) VALUES ("${event.name}", ${owner_id}, "${moment().format()}", "${event.image}", "${event.location}", "${event.description}", "${event.eventStart_date}", "${event.eventEnd_date}", ${event.n_participators}, "${event.type}")`, [tabla]);
            const results = await global.connection.promise().query(`SELECT name, image, location, description, eventStart_date, eventEnd_date, n_participators, type, owner_id, date FROM ?? WHERE id = "${add[0].insertId}"`, [tabla]);
            return results[0];

        } catch (error) {
            return error;
        }
    }

    async getEvents () {

        try {
                
            const results = await global.connection.promise().query(`SELECT id, name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, slug, type FROM ?? WHERE eventStart_date > "${moment().format()}"`, [tabla]);
            return results[0];

        } catch (error) {
            return error;
        }
    }

    async getEventsId (id) {

        try {
                
            const results = await global.connection.promise().query(`SELECT id, name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, slug, type FROM ?? WHERE id = ${id}`, [tabla]);
            return results[0];

        } catch (error) {
            return error;
        }
    }

    async getEventsBest (id) {

        try {
                
            const results = await global.connection.promise().query(`SELECT id, name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, slug, type FROM ?? WHERE id = ${id}`, [tabla]);
            return results[0];

        } catch (error) {
            return error;
        }
    }

}

module.exports = EventsDAO