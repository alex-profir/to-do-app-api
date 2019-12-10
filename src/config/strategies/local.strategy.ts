import passport from 'passport';
import admin from '../../routes/user.json';
import { Strategy } from 'passport-local';
import { MongoClient } from 'mongodb';

export default function localStragegy() {
    passport.use(new Strategy(
        {
            usernameField: 'email', passwordField: 'password'
        }, (email, password, done) => {
            const uri = `mongodb+srv://admin:admin@cluster0-6d7le.mongodb.net/todo?retryWrites=true&w=majority`;
            const client = new MongoClient(uri, { useNewUrlParser: true });
            client.connect(async err => {
                const collection = client.db("todo").collection("auth");
                const user = await collection.findOne({ email });
                if (user == null) {
                    done(null, false);
                }
                if (user.password === password) {
                    done(null, user);
                } else {
                    done(null, false);
                }
                client.close();
            });
        }));
}