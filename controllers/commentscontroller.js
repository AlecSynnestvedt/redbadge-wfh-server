const router = require('express').Router();
const { models } = require('../models');

//allow users to create comments
router.post('/comment', async (req, res) => {
  const {content, postId} = req.body.comment; 
  try {
    await models.CommentsModel.create({
      content: content, 
      postId: postId,
      userId: req.user.id
    })
    .then(
      comment => {
        res.status(201).json({
          comment: comment, 
          messge: 'comment created'
        });
      }
    )
  } catch (err) {
    res.status(500).json({
      error: `Failed to create comment: ${err}`
    });
  };
});

module.exports = router;