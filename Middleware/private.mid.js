function privateRoute(req, res, next) {  //creamos ruta privada

    console.log(req.headers);

    if (!req.headers.authorization) return next("401");

    const token = req.headers.authorization.split(" ")[1];
    const jwt = require('jsonwebtoken');

    if (token) {

        var decoded = jwt.verify(token, process.env.JWT_KEY);

        if (decoded) { 

            console.log(decoded.user);  //mostramos por pantalla el usuario

            req.USER_EMAIL = decoded.email;
            req.USER_ID = decoded.id;
            req.TOKEN = decoded.token;

            return next();

        } else {
            
            return next("401");
            
        }
    }

    return next(401);

}

module.exports = privateRoute;