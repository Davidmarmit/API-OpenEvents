class GenericDAO {

    constructor (tabla) {
        this.tabla = tabla;
    }

    async getAll() {  //extraer toda la informacion de una tabla
        // SELECT * FROM tabla
        const [results] = await global.connection.promise().query("SELECT * FROM ??", [this.tabla]);
        return results;
    }

    async get(id) {  //extraer toda la informacion de un comment, user o post por su id
        // SELECT * FROM ?? WHERE id = 'params.id'
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE id = ${id}`, [this.tabla]);
        return results;
    }

    async update(id, data) {  //editar un user, post o comentario por su id
        // UPDATE ?? SET ?? = ? WHERE id = ?
        const key = Object.keys(data)[0];
        const value = data[key];
        const results = await global.connection.promise().query(`UPDATE ?? SET ${key} = "${value}" WHERE id = ${id}`, [this.tabla]);
        return results;
    }

    async delete(id) {  //eliminar un user, comment o post por su id
        // DELETE FROM ?? WHERE id = ?
        const [results] = await global.connection.promise().query(`DELETE FROM ?? WHERE id = ${id}`, [this.tabla]);
        return results;
    }

}

module.exports = GenericDAO