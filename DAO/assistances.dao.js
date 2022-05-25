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
        //const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE idUser = ${userId} AND idPost = ${postId}`, [tabla]);
        if (/*results.length === 0*/ true) {
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

        if (body.puntuation !== null && body.commentary === null) {
            results = await global.connection.promise().query(`UPDATE ?? SET ?? = ?? WHERE ?? = ?? AND ?? = ??`, [tabla, "puntuation", body.puntuation, "user_id", userId, "event_id", eventId]);
        }
        if(body.puntuation === null && body.commentary !== null){
            results = await global.connection.promise().query(`UPDATE ?? SET ?? = ?? WHERE ?? = ?? AND ?? = ??`, [tabla, "commentary", body.commentary, "user_id", userId, "event_id", eventId]);
        }
        if(body.puntuation !== null && body.commentary !== null){
            results = await global.connection.promise().query(`UPDATE ?? SET ?? = ??, ?? = ?? WHERE ?? = ?? AND ?? = ??`, [tabla, "puntuation", body.puntuation, "commentary", body.commentary, "user_id", userId, "event_id", eventId]);
        }
        if(body.puntuation === null && body.commentary === null){
            return {
                Error: "Petición vacia"
            }
        }
        return {
            message: "Asistencia actualizada"
        }
    }
}

module.exports = AssistancesDAO