const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { verifyToken, verifyUser } = require("../middleware/verifyToken");

//Main Routes 

//Get main pages 
router.get("/home",verifyToken, homeController.getHome);
router.get("/profile/:id", homeController.getProfile);
router.get("/following", verifyToken, homeController.getfollowing)

//User registeration / sign in 
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get("/logout", authController.logout);

// router.put('/update/:id', verifyUser, authController.updateUser)
router.get('/getuser/:id',verifyUser, authController.getUserinfo)
router.get('/followStatus/:id', verifyToken, homeController.followStatus)
router.post('/followUser/:id',verifyToken, homeController.followUser)

router.post('/profilePicture/:id', verifyToken, upload.single("file"), homeController.uploadProfilePicture)


router.get("/checkauth", verifyToken, (req, res, next) => {
    res.send('hello user, you are logged in')
})
router.get("/checkuser/:id", verifyUser, (req, res, next) => {
    res.send('hello user, you are logged in and can delete your account')
})

module.exports = router;