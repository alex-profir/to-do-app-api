import passport from 'passport';
import admin from '../../routes/user.json';
import { Strategy } from 'passport-local';

export default function localStragegy() {
    passport.use(new Strategy(
        {
            usernameField: 'email', passwordField: 'password'
        }, (email, password, done) => {
            if (email === admin.email && password === admin.password) {
                const user = {
                    email, password
                }
                done(null, user);
            } else {
                done(null, false);
            }
        }));
}