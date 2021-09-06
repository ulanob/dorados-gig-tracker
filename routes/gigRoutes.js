const express = require('express');

const { getAllGigs, createGig, getGig, updateGig, deleteGig } = require('./../controllers/gigController');

const { protect, restrictTo } = require('./../controllers/authController')

const router = express.Router();

// router.param('id', checkID);

router
  .route('/')
  .get(protect, getAllGigs)
  .post(createGig);

router
  .route('/:id')
  .get(protect, getGig)
  .patch(protect, restrictTo('admin'), updateGig)
  .delete(protect, restrictTo('admin'), deleteGig);

module.exports = router;