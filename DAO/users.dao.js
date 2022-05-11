const tabla = 'users';

class UsersDAO {

    async post(user) {  //añadir un nuevo user
        // INSERT INTO ?? (??) values (??)
        const results = await global.connection.promise().query(`INSERT INTO ?? (email, password, nombre, edad) VALUES ("${user.email}", "${user.password}", "${user.nombre}", ${user.edad})`, [this.tabla]);
        return results;
    }

}

module.exports = UsersDAO