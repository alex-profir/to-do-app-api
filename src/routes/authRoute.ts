import express from 'express';
import admin from './user.json';
import passport from 'passport';
const authRouter = express.Router();

authRouter.route('/getUser')
    .all((req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
            res.writeHead(401);
        }
    })
    .get((req, res) => {
        res.json(admin);
    });
authRouter.route('/login')
    .post(passport.authenticate('local', {
        successRedirect: "/auth/getUser",
        failureFlash: 'Invalid username or password.',
    }));
export default authRouter;