const tabla = 'events';

class EventsDAO {

    async postEvent(event, owner_id) {  //añadir un nuevo event

        const results = await global.connection.promise().query(`INSERT INTO ?? (name, owner_id, date, image, location, description, eventStart_date, eventEnd_date, n_participators, type) VALUES ("${event.name}", ${owner_id}, "${Date.now()}", "${event.image}", "${event.location}", "${event.description}", "${event.eventStart_date}", "${event.eventEnd_date}", ${event.n_participators}, "${event.type},")`, [tabla]);
        console.log(results);
        return results;
    }

}

module.exports = EventsDAO