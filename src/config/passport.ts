import passport from 'passport';
import { Express } from 'express/index';
import { User } from '../models/user';
import localStragegy from './strategies/local.strategy';
function passportConfig(app: Express) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser<User, any>((user, done) => {
        done(null, user);
    });

    passport.deserializeUser<User, any>((user, done) => {
        done(null, user);
    });
    localStragegy();
}

export default passportConfig;