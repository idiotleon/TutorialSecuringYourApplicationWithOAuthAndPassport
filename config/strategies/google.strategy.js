const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const authConfig = require('../credential/auth.config');
const User = require('../../models/userModel');

module.exports = function () {
    passport.use(new GoogleStrategy({
        clientID: authConfig.googleAuth.clientID,
        clientSecret: authConfig.googleAuth.clientSecret,
        callbackURL: authConfig.googleAuth.callbackURL
    },
        function (req, accessToken, refreshToken, profile, done) {

            if (req.user) {
                var query = {};
                if (req.user.facebook) {
                    console.log('facebook - Google Strategy');
                    var query = {
                        'facebook.id': req.user.facebook.id
                    };
                } else if (req.user.twitter) {
                    console.log('twitter - Google Strategy');
                    var query = {
                        'google.id': req.user.google.id
                    };
                }
                User.findOne(query, function (error, user) {
                    if (user) {
                        user.google = {};
                        user.google.id = profile.id;
                        user.google.token = accessToken;
                        user.google.refreshToken = refreshToken;
                    }
                });
            }

            query = {
                'google.id': profile.id
            };

            User.findOne(query, function (error, user) {
                if (user) {
                    console.log('User Found - Google Strategy');
                    done(null, user);
                } else {
                    console.log('User NOT Found - Google Strategy');
                    var user = new User;

                    user.email = profile.emails[0].value;
                    user.image = profile._json.image.url;
                    user.displayName = profile.displayName;

                    user.google = {};
                    user.google.id = profile.id;
                    user.google.token = accessToken;
                    user.google.refreshToken = refreshToken;

                    user.save();
                    done(null, profile);
                }
            });
        }
    ));
}