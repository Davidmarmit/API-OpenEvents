
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
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY);

        console.log("Usuario logeado correctamente: ", token);

        return token;

    }

    async post(user,next) {
        // INSERT INTO ?? (??) values (??)
        try{
            const [results] = global.connection.promise().query(`INSERT INTO ${tabla} (??) values (\"${user.name}\", \"${user.last_name}\", \"${user.email}\", \"${user.password}\", \"${user.image}\")`, [["name", "last_name", "email", "password", "image"]]);
            return results;
        } catch (error) {
            return error;
        }
    }




}

module.exports = UsersDAO