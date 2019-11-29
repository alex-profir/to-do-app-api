import passport from 'passport';
import admin from '../../routes/user.json';
import { Strategy } from 'passport-local';

export default function localStragegy() {
    passport.use(new Strategy(
        {
            usernameField: 'email', passwordField: 'password'
        }, (email, password, done) => {
            console.log(email, password);
            if (email === admin.email && password === admin.password) {
                console.log('yes');
                const user = {
                    email, password
                }
                done(null, user);
            } else {
                console.log('no');
                done(null, false);
            }
        }));
}