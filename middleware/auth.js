//--------Importation des éléments----------
const jwt = require('jsonwebtoken'); //Les JSON web tokens sont des tokens chiffrés qui peuvent être utilisés pour l'autorisation.
const dotenv = require('dotenv');
dotenv.config();


module.exports = (req, res, next) => {
    try {
        //On récupère le token dans le headers 
        const token = req.headers.authorization.split(' ')[1];
        //On décode le token récupéré
        const decodedToken = jwt.verify(token, process.env.TOKEN_ENCODING_KEY);//La méthode verify() du package jsonwebtoken permet de vérifier la validité d'un token (sur une requête entrante, par exemple).
        //On récupère le userId dans le token décodé
        const userId = decodedToken.userId;
        //On transmet le userId a la requète pour la gestion de route et les middlewares
        req.auth = {
            userId: userId
        };
        if (req.body.userId && req.body.userId !== userId) {//si jamais le userId est différent
            throw "Invalid user ID";
          } else {
            next();
          }
        } catch {
          res.status(401).json({
            error: new Error("Invalid request!"),
          });
        }
      };