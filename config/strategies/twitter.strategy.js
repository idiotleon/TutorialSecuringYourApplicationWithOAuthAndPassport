const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const authConfig = require('../../credential/auth.config');

module.exports = function () {
    passport.use(new TwitterStrategy({
        consumerKey: authConfig.twitterAuth.consumerKey,
        consumerSecret: authConfig.twitterAuth.consumerSecret,
        callbackURL: authConfig.twitterAuth.callbackURL,
        passReqToCallback: true
    },
        function (err, req, token, tokenSecret, profile, done) {
            var user = {};

            user.image = profile._json.profile_image_url;
            user.displayName = profile.displayName;

            user.twitter = {};
            user.twitter.id = profile.id;
            user.twitter.token = token;

            if (err) {
                done(err, user);
            } else {
                done(null, user);
            }
        }));
}