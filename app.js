//-----------Importation des éléments---------
const express = require('express');
const mongoose = require('mongoose');//Mongoose est un package qui facilite les interactions avec notre base de données MongoDB
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path');
const helmet = require('helmet'); 
const dotenv = require('dotenv');
dotenv.config();

const app = express();
// Cela permet de masquer le fait que nous utilison express
app.use (helmet.xssFilter());

//Déclaration des variables d'environnement pour MongoDB
const databaseUsername = process.env.DATABASE_USERNAME;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;

//Connection à la BDD MongoDB
mongoose.connect('mongodb+srv://' + databaseUsername + ':' + databasePassword + databaseUrl,
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Connexion à MongoDB réussie !' ))
.catch(() => console.log( 'Connexion à MongoDB échouée !' ));

//Utilisation de Express par l'application
app.use(express.json());//La méthode app.use() vous permet d'attribuer un middleware à une route spécifique de votre application.
//rend les données du corps de la requête exploitables.Quand une requête HTTP est reçue par le serveur, son corps est rarement sous forme utile. Le package body-parser analyse le corps de la requête, et le formate pour en faciliter l'exploitation.

//ajout des en-têtes à notre navigateur-middleware général qui sera effectué à toutes les routes
//pour que tout le monde puisse se connecter ('*') et éviter les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Route pour les sauces
app.use('/api/sauces', sauceRoutes);
//Route pour les utilisateurs
app.use('/api/auth', userRoutes);
//Route pour les fichiers statiques vers le répertoire /images
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;