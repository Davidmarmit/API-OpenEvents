const tabla = 'assistance';

class AssistancesDAO {

    async post(comment) {  //añadir un nuevo comment
        // INSERT INTO ?? (??) values (??)
        const results = await global.connection.promise().query(`INSERT INTO ?? (idUser, idPost, idComent, contenido) VALUES (${comment.idUser}, ${comment.idPost}, ${comment.idComment}, "${comment.contenido}")`, [tabla]);
        return results;
    }

    async getNumCommentsUser(idUser) {  //saber numero comentarios por id user
        //SELECT COUNT(*) FROM ?? WHERE idUser = 'params.idUser'
        const [results] = await global.connection.promise().query(`SELECT COUNT(*) FROM ?? WHERE idUser = ${idUser}`, [tabla]);
        return results;
    }

    async getNumCommentsPost(idPost) {  //saber numero comentarios por id post
        //SELECT COUNT(*) FROM ?? WHERE idPost = 'params.idPost'
        const [results] = await global.connection.promise().query(`SELECT COUNT(*) FROM ?? WHERE idPost = ${idPost}`, [tabla]);
        return results;
    }

    async getCommentsPost(idPost) {  //extraer comentarios de un post
        //SELECT * FROM ?? WHERE idPost = 'params.idPost'
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE idPost = ${idPost}`, [tabla]);
        return results;
    }

    async getAssistances(userId, postId) {
        //SELECT * FROM ?? WHERE idUser = 'params.idUser' AND idPost = 'params.idPost'
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE user_id = ${userId} AND event_id = ${postId}`, [tabla]);
        if (results.length === 0) {
            return {
                error: "No se ha encontrado ninguna asistencia"
            }
        }else{
            return results;
        }

    }

    async postAssistances(userId, eventId) {
        //INSERT INTO ?? (??) values (??)
        const results = await global.connection.promise().query(`INSERT INTO ?? (user_id, event_id) VALUES (${userId}, ${eventId})`, [tabla]);
        return {
            message: "Asistencia añadida"
        }
    }

    async putAssistances(userId, eventId, body) {
        //UPDATE ?? SET ?? = ?? WHERE ?? = ?? AND ?? = ??
        let results = ""

        if (body.puntuation !== undefined && body.comentary === undefined) {
            results = await global.connection.promise().query(`UPDATE ?? SET ?? = ${body.puntuation} WHERE ?? = ${userId} AND ?? = ${eventId}`, [tabla, "puntuation","user_id", "event_id"]);
        }
        if(body.puntuation === undefined && body.comentary !== undefined){
            results = await global.connection.promise().query(`UPDATE ?? SET ?? = "${body.comentary}" WHERE user_id = ${userId} AND event_id = ${eventId}`, [tabla, "comentary"]);
        }
        if(body.puntuation !== undefined && body.comentary !== undefined){
            results = await global.connection.promise().query(`UPDATE ?? SET ?? = ${body.puntuation}, ?? = "${body.comentary}" WHERE user_id = ${userId} AND event_id = ${eventId}`, [tabla, "puntuation", "comentary"]);
        }
        if(body.puntuation === undefined && body.comentary === undefined){
            return {
                error: "Petición vacia"
            }
        }
        return {
            message: "Asistencia actualizada"
        }
    }
}

module.exports = AssistancesDAO