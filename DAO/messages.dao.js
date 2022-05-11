const tabla = 'messages';

class MessagesDAO {

    async post(comment) {  //añadir un nuevo comment
        // INSERT INTO ?? (??) values (??)
        const results = await global.connection.promise().query(`INSERT INTO ?? (idUser, idPost, idComent, contenido) VALUES (${comment.idUser}, ${comment.idPost}, ${comment.idComment}, "${comment.contenido}")`, [this.tabla]);
        return results;
    }

    async getNumCommentsUser(idUser) {  //saber numero comentarios por id user
        //SELECT COUNT(*) FROM ?? WHERE idUser = 'params.idUser'
        const [results] = await global.connection.promise().query(`SELECT COUNT(*) FROM ?? WHERE idUser = ${idUser}`, [this.tabla]);
        return results;
    }

    async getNumCommentsPost(idPost) {  //saber numero comentarios por id post
        //SELECT COUNT(*) FROM ?? WHERE idPost = 'params.idPost'
        const [results] = await global.connection.promise().query(`SELECT COUNT(*) FROM ?? WHERE idPost = ${idPost}`, [this.tabla]);
        return results;
    }

    async getCommentsPost(idPost) {  //extraer comentarios de un post
        //SELECT * FROM ?? WHERE idPost = 'params.idPost'
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE idPost = ${idPost}`, [this.tabla]);
        return results;
    }
}

module.exports = CommentsDAO