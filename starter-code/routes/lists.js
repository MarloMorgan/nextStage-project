'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/authmiddleware');
const Request = require('../models/request');

router.get('/host-list', authMiddleware.requireUserArtist, (req, res, next) => {
  User.find({ role: 'Host' })
    .then((users) => {
      res.render('lists/host-list', { users });
    })
    .catch(next);
});

router.post('/host-list/:id', (req, res, next) => {
  const hostId = req.params.id;
  const { _id, email, artist } = req.session.currentUser;
  const request = {
    hostId,
    artistId: _id,
    artistEmail: email,
    bandName: artist.bandName,
    genre: artist.genre,
    status: 'pending'
  };
  Request.create(request)
    .then((newRequest) => {
      res.redirect('/lists/host-list');
    })
    .catch(next);
});

router.get('/artist-requests-list', (req, res, next) => {
  let isArtist = false;
  let isHost = false;
  if (req.session.currentUser.role === 'Artist') {
    isArtist = true;
  }
  if (req.session.currentUser.role === 'Host') {
    isHost = true;
  }
  User.find({ role: 'Host' })
    .then((users) => {
      const data = {
        users,
        isArtist,
        isHost
      };
      res.render('lists/artist-requests-list', data);
    })
    .catch(next);
});

// we are retrieving artist info based on artist id but the host is the logged in one
router.get('/my-requests', (req, res, next) => {
  const { _id } = req.session.currentUser;
  Request.find({ hostId: _id })
    .populate('artistId')
    .then((result) => {
      console.log(result);
      res.render('lists/host-requests-list', { requests: result });
    })
    .catch(next);
});
module.exports = router;
