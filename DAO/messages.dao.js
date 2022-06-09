const tabla = 'message';
const res = require('express/lib/response');
const moment = require('moment');

class MessagesDAO {

    async postMessage(message) {  //añadir un nuevo message
    
        try {
            const add = await global.connection.promise().query(`INSERT INTO ?? (content, user_id_send, user_id_recived, timeStamp) VALUES ("${message.content}", ${message.user_id_send}, ${message.user_id_recived}, "${moment().format()}")`, [tabla]);
            const results = await global.connection.promise().query(`SELECT id, content, user_id_send, user_id_recived, timeStamp FROM ?? WHERE id = "${add[0].insertId}"`, [tabla]);
            return results[0];
        } catch (error) {
            return { error: "Missing parameter." };    
        }
    }

    async getMessagesUser(id) {  

        const results = await global.connection.promise().query(`SELECT users.id, users.name, users.last_name, users.email FROM users INNER JOIN message ON users.id = message.user_id_send WHERE message.user_id_recived = ?`, [id]);
        if (results[0].length === 0) {
            return { error: "No tienes conversaciones con ningún usuario." };
        } else {
            return results[0];
        }
    }

    async getMessagesUserId(id, owner_id) {  

        const results = await global.connection.promise().query(`SELECT * FROM ?? WHERE (user_id_send = ${owner_id} AND user_id_recived = ${id}) OR (user_id_send = ${id} AND user_id_recived = ${owner_id})`, [tabla]);
        if (results[0].length == 0) {
            return { error: "No tienes conversaciones con este usuario." };
        } else {
            return results[0];
        }
    }

}

module.exports = MessagesDAO;