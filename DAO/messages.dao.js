const tabla = 'message';
const res = require('express/lib/response');
const moment = require('moment');

class MessagesDAO {

    async postMessage(message) {  //añadir un nuevo message
        //${moment().format()}
        const results = await global.connection.promise().query(`INSERT INTO ?? (idUser, idPost, idComent, contenido) VALUES (${comment.idUser}, ${comment.idPost}, ${comment.idComment}, "${comment.contenido}")`, [this.tabla]);
        return results;
    }
}

module.exports = MessagesDAO;