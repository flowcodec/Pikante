//---------Importation des éléments-----------
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//Déclaration du schema mongoose pour l'utilisateur (modèle)
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },// pour évité que plusieurs utilisateurs aient la même adresse mail
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);//mongoose-unique-validator  améliore les messages d'erreur lors de l'enregistrement de données uniques.

module.exports = mongoose.model('User', userSchema);