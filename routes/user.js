//-----------Importation des éléments----------
const express = require('express');
const router = express.Router();//création du router

const userCtrl = require('../controllers/user');//controlleur pr assurer les fonctions aux différentes routes

//Route pour l'inscription d'un l'utilisateur
router.post('/signup', userCtrl.signup);
//Route pour la connexion de l'utilisateur déjà inscrit
router.post('/login', userCtrl.login);

module.exports = router;//export du router pour l'exporter dans app.js