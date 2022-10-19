/*La méthode  model  transforme ce modèle en un modèle utilisable.*/

//---------Importation de mongoose---------
const mongoose = require('mongoose');
//Déclaration du schema de données mongoose pour les sauces(modèle)
const sauceSchema = mongoose.Schema({
    userId: { type:String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true},
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked:  { type: Array } ,
    usersDisliked: { type: Array },
});

module.exports = mongoose.model('Sauce', sauceSchema);