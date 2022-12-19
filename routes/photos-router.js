const router = require('express').Router();
const authenticationMiddleware = require('../middlewares/authentication-middleware');
const PhotosController = require('../controllers/photos-controller');

router.use(authenticationMiddleware);
router.get('/', PhotosController.getAllPhotos);
router.get('/:id', PhotosController.getOnePhotoByID);
router.post('/', PhotosController.createPhoto);

module.exports = router;
