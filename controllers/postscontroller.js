const router = require('express').Router();
const { models } = require('../models');

//let users create posts
router.post('/post', async (req, res) => {
  const {title, content} = req.body.post; 
  try{
    await models.PostsModel.create({
      title: title, 
      content: content, 
      userId: req.user.id
    })
    .then(
      post => {
        res.status(201).json({
          post: post, 
          message: 'post created'
        });
      }
    )
  } catch (err) {
    res.status(500).json({
      error: `Failed to create post: ${err}`
    });
  };
});

module.exports = router;