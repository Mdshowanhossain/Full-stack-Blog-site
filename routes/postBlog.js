const express = require('express');
const multer = require('multer');
const Blog = require('../models/blogSchema');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
    res.render('postBlog');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/blogImages')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3
    }
});


router.post('/', upload.single('image'), async (req, res) => {
    const { category, title, description } = req.body;
    try {
        const postBlog = await new Blog({
            category: category,
            title: title,
            description: description,
            image: req.file.filename,
        })
        const saveBlog = await postBlog.save();
        res.redirect('/')
    }
    catch (err) {
        console.log(err)
    }
});

module.exports = router;