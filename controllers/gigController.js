const Gig = require('../models/gigModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')

exports.getAllGigs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Gig.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const gigs = await features.query;

  // Send Response
  res.status(200).json({
    status: 'success',
    results: gigs.length,
    data: {
      gigs
    }
  });
});

exports.getGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) {
    return next(new AppError('No gig found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      gig
    }
  })
});

exports.createGig = catchAsync(async (req, res, next) => {
  const newGig = await Gig.create(req.body)
  // .then();
  res.status(201).json({
    status: 'success',
    data: {
      gig: newGig
    }
  })
});

exports.updateGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!gig) {
    return next(new AppError('No gig found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      gig
    }
  })
});

exports.deleteGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findByIdAndDelete(req.params.id)

  if (!gig) {
    return next(new AppError('No gig found with that ID', 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  })
});
