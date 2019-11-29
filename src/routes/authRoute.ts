import express from 'express';
import admin from './user.json';
const authRouter = express.Router();

authRouter.route('/login').post((req, res, ) => {
    if (req.body !== null) {
        const { email, password } = req.body;
        if (email === admin.email && password === admin.password) {
            res.json(admin);
            res.status(200);
        } else {
            res.json({ status: 400, message: "Bad Request" });
            res.status(400);
        }
    } else {
        res.json({ status: 404, message: "Not Found" });
        res.status(404);
    }
});

export default authRouter;