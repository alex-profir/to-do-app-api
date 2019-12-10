import express from 'express';
import { MongoClient } from 'mongodb';
import passport from 'passport';
const authRouter = express.Router();
function router() {
    authRouter.route('/createAdmin')
        .get((req, res) => {
            const uri = `mongodb+srv://admin:admin@cluster0-6d7le.mongodb.net/todo?retryWrites=true&w=majority`;
            const client = new MongoClient(uri, { useNewUrlParser: true });
            client.connect(async err => {
                const collection = client.db("todo").collection("auth"); 
                const response = await collection.insertOne({ email: "ion@admin.com", password: "admin" });
                res.json(response);
                client.close();
            });
        });
    authRouter.route('/login')
        .post(passport.authenticate('local'), (req, res) => {
            res.json(req.user);
        });
    return authRouter;
}
export default router;