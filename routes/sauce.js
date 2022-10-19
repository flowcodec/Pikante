//------------Importation des éléments-------
const express = require('express');
const router = express.Router();//cette méthode permet de créer des routeurs séparés pour chaque route principale de votre application – vous y enregistrez ensuite les routes individuelles.

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');
const userSauceAuth = require('../middleware/userSauceAuth');

//--------------Liste des routes------------
//Route pour récupérer l'ensemble des sauces
router.get('/', auth, sauceCtrl.getAllSauces);
//Route pour créer une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
//Route pour récupérer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//Route pour modifier la sauce
router.put('/:id', auth , userSauceAuth, multer, sauceCtrl.modifySauce);
//Route pour supprimer une sauce
router.delete('/:id', auth, userSauceAuth, multer, sauceCtrl.deleteSauce); 
//Route pour la fonction like/dislike
router.post('/:id/like', auth, sauceCtrl.addNotice);

module.exports = router;