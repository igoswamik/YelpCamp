const express=require('express');
const router=express.Router({mergeParams:true});  //this will merge params which is /campground/:id/reviews here so that we can have acces to thid id inside params over here

const catchAsync=require('../utils/catchAsync');
const Review=require('../models/review');
const reviews=require('../controllers/reviews');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');


router.post('/',isLoggedIn ,validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports = router;