const GenericDAO = require("./generic.dao");

class PostsDAO extends GenericDAO {

    constructor() {
        super("post")
    }

    async post(post) {  //añadir un nuevo post
        // INSERT INTO ?? (??) values (??)
        const results = await global.connection.promise().query(`INSERT INTO ?? (idUser, UIDimagen) VALUES (${post.idUser}, "${post.UIDimagen}")`, [this.tabla]);
        return results;
    }

    async getPostsUser(idUser) {  //saber posts hechos por id de user
        // SELECT * FROM ?? WHERE idUser = 'params.idUser'
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE idUser = ${idUser}`, [this.tabla]);
        return results;
    }

    async getNumPosts(idUser) {  //saber numero posts hechos por user
        //SELECT COUNT(*) FROM ?? WHERE idUser = 'params.idUser'
        const [results] = await global.connection.promise().query(`SELECT COUNT(*) FROM ?? WHERE idUser = ${idUser}`, [this.tabla]);
        return results;
    }

}

module.exports = PostsDAO