const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { verifyToken, verifyUser } = require("../middleware/verifyToken");

//Post Routes 
router.get("/:id", postsController.getPost)
router.post("/createPost/",verifyToken, upload.single("file"), postsController.createPost);
router.put("/likePost/:id", verifyToken, postsController.likePost);
router.delete("/deletePost/:id", verifyToken, postsController.deletePost)
router.put("/editPost/:id", verifyToken, upload.single("file"), postsController.editPost)

module.exports = router;