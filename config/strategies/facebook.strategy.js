const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const authConfig = require('../../credential/auth.config');

module.exports = function () {
    passport.use(new FacebookStrategy(
        {
            clientID: authConfig.facebookAuth.clientID,
            clientSecret: authConfig.facebookAuth.clientSecret,
            callbackURL: authConfig.facebookAuth.callbackURL,
            passReqToCallback: true
        },
        function (req, accessToken, refreshToken, profile, done) {
            var user = {};

            user.email = profile.emails[0].value;
            user.displayName = profile.displayName;

            user.facebook = {};
            user.facebook.id = profile.id;
            user.facebook.token = accessToken;

            done(null, user);
        }));
}
