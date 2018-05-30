const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const authConfig = require('../credential/auth.config');
const User = require('../../models/userModel');

module.exports = function () {
    passport.use(new FacebookStrategy(
        {
            clientID: authConfig.facebookAuth.clientID,
            clientSecret: authConfig.facebookAuth.clientSecret,
            callbackURL: authConfig.facebookAuth.callbackURL,
            passReqToCallback: true,
            profileFields: ['emails']
        },
        function (req, accessToken, refreshToken, profile, done) {

            if (req.user) {
                var query = {};
                if (req.user.google) {
                    console.log('google');
                    var query = {
                        'google.id': req.user.google.id
                    };
                } else if (req.user.twitter) {
                    var query = {
                        'twitter.id': req.user.twitter.id
                    };
                }
                User.findOne(query, function (error, user) {
                    if (user) {
                        user.facebook = {};
                        user.facebook.id = profile.id;
                        user.facebook.token = token;
                        user.facebook.refreshToken = refreshToken;

                        user.save();
                        done(null, user);
                    }
                });
            }


            var query = {
                'facebook.id': profile.id
            };

            User.findOne(query, function (error, user) {
                if (user) {
                    console.log('User Found - Facebook Strategy');
                    done(null, user);
                } else {
                    console.log('User NOT Found - Facebook Strategy');
                    var user = new User;

                    user.email = profile.emails[0].value;
                    user.displayName = profile.displayName;

                    user.facebook = {};
                    user.facebook.id = profile.id;
                    user.facebook.token = accessToken;
                    user.facebook.refreshToken = refreshToken;

                    user.save();
                    done(null, user);
                }
            });
        }));
}
