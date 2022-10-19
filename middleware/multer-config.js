//Configuration de multer pour l'importation de fichiers
const multer = require('multer');
//Dictionnaire des types de fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        //Répertoire de destination des fichiers si pas d'erreur
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        //On récupère le nom de fichier en remplaçant les espaces par des underscores
        const name = file.originalname.split(' ').join('_');
        //On créé l'extension du fichiers avec le dictionnaire
        const extension = MIME_TYPES[file.mimetype];
        //On créé le filename entier avec un timestamp pour le rendre le plus unique possible et son extension
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');