
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tabla = 'users';

class UsersDAO {

    async login(body) {

        const { email, password } = body;
        const bcrypt = require("bcrypt");
        const [user] = await global.connection.promise().query(`SELECT * FROM users WHERE email = "${email}"`);

        // si no existe el usuario
        if (!user) return next("user not found")

        // si la contraseña no es correcta
        if (!bcrypt.compareSync(password, user[0].password)) return next("wrong password")

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_KEY/*, { expiresIn: "12h" }*/)
        console.log("Usuario logeado correctamente: ", token);

        return token;

    }

    async post(user) {
        // INSERT INTO ?? (??) values (??)
        try {
            const [results] = global.connection.promise().query(`INSERT INTO ${tabla} (??) values (\"${user.name}\", \"${user.last_name}\", \"${user.email}\", \"${user.password}\", \"${user.image}\")`, [["name", "last_name", "email", "password", "image"]]);
            return results;
        } catch (error) {
            return error;
        }
    }


    async getAll() {
        // SELECT * FROM tabla
        const [results] = await global.connection.promise().query("SELECT * FROM ??", [tabla])
        return results;
    }

    async getUsersId(id) {
        // SELECT * FROM ?? WHERE id = 'params.id'
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE id = ${id}`, [tabla])
        if (results.length === 0) {
            return {
                error: "No se encontró el usuario con el id: " + id
            }
        }else{
            results[0].password = undefined;
            return results;
        }
    }

    async getUsersSearch(search) {
        // SELECT * FROM ?? WHERE name LIKE '%params.search%'
        const [results] = await global.connection.promise().query(`SELECT * FROM ?? WHERE name LIKE '%${search}%'`, [tabla])
        if (results.length === 0) {
            return {
                error: "No se encontró ningun usuario con nombre, last_name o email con : " + search
            }
        }else{
            return results;
        }
    }
}

module.exports = UsersDAO