//----------Importation des éléments-------------
const bcrypt = require('bcrypt');//Le package bcrpyt permet un cryptage sécurisé avec un algorithme unidirectionnel.bcrypt sait quand deux hashs différents ont été produits à partir du même string d'origine.
const jwt = require('jsonwebtoken');//Les tokens JWT sont encodés et non cryptés, et peuvent donc être décodés avec la clé secrète.

const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const encodingKey = process.env.TOKEN_ENCODING_KEY;

exports.signup = (req, res, next) => {
    //Hachage du mot de passe utilisateur avec 10 représente le salt ce qui correspond au nombre de fois qu'on execute l'alcorythme de hashage
    bcrypt.hash(req.body.password, 10)//La méthode hash() de bcrypt crée un hash crypté des mots de passe de vos utilisateurs pour les enregistrer de manière sécurisée dans la base de données.
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //enrgistrement de l'utilisateur dans la BDD
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            //Si l'utilisateur n'existe pas (e-mail non valide)
            if (!user) {
                return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte !' });
            }
            //On compare le mot de passe de la requête avec celui stocké dans la BDD
            bcrypt.compare(req.body.password, user.password)//la méthode compare de bcrypt compare un string avec un hash pour, par exemple, vérifier si un mot de passe entré par l'utilisateur correspond à un hash sécurisé enregistré en base de données. Cela montre que même bcrypt ne peut pas décrypter ses propres hashs.
                .then(valid => {
                    //Si les mot de passe sont différents
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte !' });
                    }
                    //Si mot de passe OK on retourne les informations d'authentification nécessaires au client pour ses différentes requête
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( //La méthode sign() du package jsonwebtoken utilise une clé secrète pour chiffrer un token qui peut contenir un payload personnalisé et avoir une validité limitée.
                            { userId: user._id },
                            encodingKey,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};