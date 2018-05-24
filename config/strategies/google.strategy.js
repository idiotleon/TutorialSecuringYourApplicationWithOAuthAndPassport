const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const authConfig = require('../../credential/auth.config');

module.exports = function () {
    passport.use(new GoogleStrategy({
        clientID: authConfig.googleAuth.clientID,
        clientSecret: authConfig.googleAuth.clientSecret,
        callbackURL: authConfig.googleAuth.callbackURL
    },
        function (req, accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    ));
}