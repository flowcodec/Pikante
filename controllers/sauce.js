/* Un fichier de contrôleur exporte des méthodes qui sont ensuite attribuées aux routes 
pour améliorer la maintenabilité de votre application.*/ 
/*Les contrôleurs contiennent la logique métier, et sont généralement importés par les routeurs,
 qui attribuent cette logique aux routes spécifiques. */

//---------Importation des éléments----------
const Sauce = require('../models/Sauce');
const fs = require('fs');//Le package fs expose des méthodes pour interagir avec le système de fichiers du serveur.

//Créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        //Reconstruction de l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //Enregistrement de la sauce dans la BDD
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' })})
        .catch(error => { res.status(400).json({ error })});
    };
   
//Modifier une sauce
exports.modifySauce = (req, res, next) => {
    //On regarde si la requête contient un fichier
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    //Si il y a un fichier lors de la modification
    if (sauceObject !== null) {
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                //Suppression de l'image dans le répertoire images
                const filename = sauce.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () => {//La méthode unlink() du package  fs  vous permet de supprimer un fichier du système de fichiers.
                    //Mise à jour de la BDD avec la nouvelle image
                    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                        .catch((error) => res.status(401).json({ error }));
                });
            })
            .catch((error) => res.status(401).json({ error }));
    }
    else {
        //Si il n'y a pas de fichier lors de la modification mise à jour de la BDD avec le body de la requête
        Sauce.updateOne({_id: req.params.id}, {...req.body})
            .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
            .catch((error) => res.status(401).json ({ error }));
    };
 };

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            //Suppression de l'image dans le répertoire images
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                //Suppression de l'objet dans la BDD
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => {
                        res.status(200).json({ message: 'Sauce supprimée !' });
                    })
                    .catch((error) => res.status(401).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

//Récupérer la sauce sélectionnée
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

//Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//---------------------Gestion des Likes et Dislikes--------------

exports.addNotice = (req, res, next) => {
    const likeValue = req.body.like;
    const userId = req.body.userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            const usersAllreadyLiked = sauce.usersLiked.includes(userId);
            const usersAllreadyDisliked = sauce.usersDisliked.includes(userId);
                //Si l'utilisateur n'a pas déjà like ou dislike
                if (!usersAllreadyLiked && !usersAllreadyDisliked) {
                    //Si la valeur du like vaut 1
                    if(likeValue === 1) {
                        /*On met à jour la sauce dans la BDD 
                        avec incrémentation de "likes" et ajout de l'id utilisateur dans usersLiked*/
                        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: +1}, $push: {usersLiked: userId}})
                            .then(() => res.status(201).json({ message: 'Like enregistré !' }))
                            .catch((error) => res.status(401).json({ error }));
                    }
                    //Si la valeur de like vaut -1
                    if (likeValue === -1) {
                        /*On met à jour la sauce dans la BDD 
                        avec incrémentation de "dislikes" et ajout de l'id utilisateur dans usersDisliked*/
                        Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: +1}, $push: {usersDisliked: userId}})
                            .then(() => res.status(201).json({ message: 'Dislike enregistré !' }))
                            .catch((error) => res.status(401).json({ error }));
                    }
                }
                //Si l'utilisateur a déjà like
                if (usersAllreadyLiked == true && !usersAllreadyDisliked) {
                    //Si la valeur du like vaut 0
                    if (likeValue === 0) {
                        /*On met à jour la sauce dans la BDD 
                        avec décrémentation de likes et retrait de l'id utilisateur dans usersLiked*/
                        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: userId}})
                            .then(() => res.status(201).json({ message: 'Like annulé !' }))
                            .catch((error) => res.status(401).json({ error }));
                    }
                }
                //Si l'utilisateur a déjà dislike
                if (!usersAllreadyLiked && usersAllreadyDisliked == true) {
                    //Si la valeur de like vaut 0
                    if (likeValue === 0) {
                    /*On met à jour la sauce dans la BDD 
                    avec décrémentation de dislikes et retrait de l'id utilisateur dans usersDisliked*/
                        Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
                            .then(() => res.status(201).json({ message: 'Dislike annulé !' }))
                            .catch((error) => res.status(401).json({ error }));
                    }
                }
            
        })
        .catch((error) => res.status(404).json({ error }));
};