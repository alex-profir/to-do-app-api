import express from 'express';
import todos from './todos.json';
import fs from 'fs';
import { MongoClient, ObjectID, ObjectId } from 'mongodb';
const todoRouter = express.Router();

function router() {
    // todoRouter.use((req, res, next) => {
    //     if (req.user) {
    //         next();
    //     } else {
    //         res.status(401).send()
    //     }
    // })
    todoRouter.route('/getTodos')
        .get((req, res) => {
            const uri = `mongodb+srv://admin:admin@cluster0-6d7le.mongodb.net/todo?retryWrites=true&w=majority`;
            const client = new MongoClient(uri, { useNewUrlParser: true });
            client.connect(async err => {
                const collection = client.db("todo").collection("todos");
                const response = await collection.find().toArray();
                res.json(response);
                client.close();
            });
        });
    todoRouter.route('/addTodo')
        .post((req, res) => {
            const { task, who, dueDate, done } = req.body;
            // some bs way but fuck it
            if (!task || !who || !dueDate || !done || typeof done !== "boolean" || typeof task !== "string" || typeof who !== "string" || typeof dueDate !== "string") {
                res.writeHead(400)
                res.write("Missing props");
                res.end();
            }

            const uri = `mongodb+srv://admin:admin@cluster0-6d7le.mongodb.net/todo?retryWrites=true&w=majority`;
            const client = new MongoClient(uri, { useNewUrlParser: true });
            client.connect(async err => {
                const collection = client.db("todo").collection("todos");
                const newTask = { task, who, dueDate, done };
                const response = await collection.insertOne(newTask);
                res.json(response.ops[0]);
                client.close();
            });
        });
    todoRouter.route('/getTodoById/:id')
        .get((req, res) => {
            const id = req.params.id;
            if (!ObjectID.isValid(id)) {
                res.writeHead(400);
                res.end();
            } else {
                const uri = `mongodb+srv://admin:admin@cluster0-6d7le.mongodb.net/todo?retryWrites=true&w=majority`;
                const client = new MongoClient(uri, { useNewUrlParser: true });
                client.connect(async err => {
                    const collection = client.db("todo").collection("todos");
                    const obj = { _id: new ObjectID(id) };
                    const response = await collection.findOne(obj);
                    if (response === null) {
                        res.json({});
                    }
                    else {
                        res.json(response);
                    }
                    client.close();
                });
            }
        })


    todoRouter.route('/deleteTodo/:id')
        .delete((req, res) => {
            const id = req.params.id;
            if (!ObjectID.isValid(id)) {
                res.writeHead(400);
                res.end();
            } else {
                const uri = `mongodb+srv://admin:admin@cluster0-6d7le.mongodb.net/todo?retryWrites=true&w=majority`;
                const client = new MongoClient(uri, { useNewUrlParser: true });
                client.connect(async err => {
                    const collection = client.db("todo").collection("todos");
                    const obj = { _id: new ObjectID(id) };
                    const response = await collection.deleteOne(obj);
                    console.log(response.deletedCount);
                    if (response.deletedCount! < 1) {
                        res.status(404).json({ message: "Object was not found in db" }).send;
                    }
                    else {
                        res.json({ message: "Deleted was successful" });
                    }
                    client.close();
                });
            }
        })
    return todoRouter;
}
export default router;