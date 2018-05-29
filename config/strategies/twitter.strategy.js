const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const authConfig = require('../../credential/auth.config');
const User = require('../../models/userModel');

module.exports = function () {
    passport.use(new TwitterStrategy({
        consumerKey: authConfig.twitterAuth.consumerKey,
        consumerSecret: authConfig.twitterAuth.consumerSecret,
        callbackURL: authConfig.twitterAuth.callbackURL,
        passReqToCallback: true
    },
        function (req, token, tokenSecret, profile, done) {

            if (req.user) {
                var query = {};
                if (req.user.google) {
                    console.log('google - Twitter Strategy');
                    var query = {
                        'google.id': req.user.google.id
                    };
                } else if (req.user.facebook) {
                    console.log('facebook - Twitter Strategy');
                    var query = {
                        'facebook.id': req.user.facebook.id
                    };
                }
                User.findOne(query, function (error, user) {
                    if (user) {
                        user.twitter = {};
                        user.twitter.id = profile.id;
                        user.twitter.token = token;
                        user.twitter.tokenSecret = tokenSecret;

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
                    console.log('User Found - Twitter Strategy');
                    done(null, user);
                } else {
                    console.log('User NOT Found - Twitter Strategy');
                    user = new User;
                    user.image = profile._json.profile_image_url;
                    user.displayName = profile.displayName;

                    user.twitter = {};
                    user.twitter.id = profile.id;
                    user.twitter.token = token;
                    user.twitter.tokenSecret = tokenSecret;

                    user.save();
                    done(null, user);
                }
            });
        }));
}