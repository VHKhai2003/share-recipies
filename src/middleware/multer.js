const multer  = require('multer');
const path = require('path');

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/avatars/"));
    },
    filename: function (req, file, cb) {
        // user must be authenticated 
        const uniqueName = req.user.username + Date.now();
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const pictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/pictures/"));
    },
    filename: function (req, file, cb) {
        // user must be authenticated 
        const uniqueName = req.user.username + Date.now();
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const uploadAvatar = multer({ storage: avatarStorage });
const uploadPicture = multer({ storage: pictureStorage });

module.exports = {
    uploadAvatar, uploadPicture
}