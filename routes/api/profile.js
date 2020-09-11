const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Profile
const User = require('../../models/User');


// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Profile works'}));

// @route   GET api/profile
// @desc    Get ccurrent users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
}) 

// @route   POST api/profile
// @desc    Create user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const errors = {};
    // Get fields
    const profileFields = {

    };
    profileFields.user = req.user.id;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website= req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if(typeof(req.body.skills !== 'undefined')){
        // Get an array of skills to put into the database
        profileFields.skills = req.body.skills.split(','); 
    }

    // Social is an object
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne( {user: req.user.id })
        .then(profile => {
            if(profile) {
                // If there is a profile, update it
                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true})
                    .then(profile => res.json(profile));
            } else {
                // Create one if there is no profile

                // Check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile){
                            errrors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }
                        // Save profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    });
            }
        });
}); 


module.exports = router;



