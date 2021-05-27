const router = require('express').Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');

//allow users to signup
router.post('/signup', async (req, res) => {
  const {username, password} = req.body.user; 
  try {
    await models.UsersModel.create({
      username: username, 
      password: bcrypt.hashSync(password)
    })
    .then(
      user => {
        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
        res.status(201).json({
          user: user, 
          message: 'user created', 
          sessionToken: token
        });
      }
    )
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: 'Username already in use'
      });
    } else {
      res.status(500).json({
        error: `Failed to register user: ${err}`
      });
    };
  };
});

//show all Users and any of their associated Posts and Comments
router.get('/userinfo', async (req, res) => {
  try {
    await models.UsersModel.findAll({
      include: [
        {
          model: models.PostsModel,
          include: [
            {
              model: models.CommentsModel
            }
          ]
        }
      ]
    })
    .then(
      users => {
        res.status(200).json({
          users: users
        });
      }
    )
  } catch (err) {
    res.status(500).json({
      error: `Failed to retrieve users: ${err}`
    });
  };
});

module.exports = router;