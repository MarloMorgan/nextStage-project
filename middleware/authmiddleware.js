'use strict';

const authMiddleware = {};
// if user is logged in, can't login or sign up
authMiddleware.requireAnon = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

// if user is not logged in, can't log out
authMiddleware.requireUser = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  next();
};

authMiddleware.requireUserArtist = (req, res, next) => {
  if (!req.session.currentUser || req.session.currentUser.role !== 'Artist') {
    return res.redirect('/auth/login');
  }
  next();
};

module.exports = authMiddleware;
