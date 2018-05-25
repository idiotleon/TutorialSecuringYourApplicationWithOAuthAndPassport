const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const AuthConfig = require('../../credential/auth.config');

module.exports = function () {
    passport.use(new TwitterStrategy({
        consumerKey: AuthConfig.twitterAuth.consumeKey,
        consumerSecret: AuthConfig.twitterAuth.consumerSecret,
        callbackURL: AuthConfig.twitterAuth.callbackURL,
        passReqToCallback: true
    },
        function (req, token, tokenSecret, profile, done) {
            var user = {};

            user.image = profile._json.image.url;
            user.displayName = profile.displayName;

            user.twitter = {};
            user.twitter.id = profile.id;
            user.twitter.token = accessToken;

            done(null, user);
        }));
}