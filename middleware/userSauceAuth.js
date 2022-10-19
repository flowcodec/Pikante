/*Middleware pour vérifier que l'utilisateur qui souhaite modifier 
ou supprimer une sauce est bien celui qui l'a créée*/
const Sauce = require("../models/Sauce");

module.exports = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            //On vérifie que le userId de la requête est bien le même que le userId de l'utilisateur qui a créé la sauce
            if (sauce.userId == req.auth.userId) {
                next();
            } 
            else {
                res.status(401).json({ message: "Vous n'êtes pas autorisé à modifier ou supprimer cette sauce !" });
            };      
        })
        .catch(error => res.status(401).json({ error }));   
};