import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import moment from 'moment';
import { Todo } from '../models/todo';
import { uri } from '../config/mongo';
const todoRouter = express.Router();

function router() {
    // todoRouter.use((req, res, next) => {
    //     if (req.user) {
    //         next();
    //     } else {
    //         res.status(401).send()
    //     }
    // });
    todoRouter.route('/getTodos')
        .get((req, res) => {
            const client = new MongoClient(uri, { useNewUrlParser: true });
            client.connect(async err => {
                const collection = client.db("todo").collection("todos");
                const response = (await collection.find().toArray());
                res.json(response);
                client.close();
            });
        });
    todoRouter.route('/getFilteredTodos')
        .post((req, res) => {
            const { pageSize, pageNr, key, status } = req.body;
            if (typeof pageSize !== "number" || typeof pageNr !== "number") {
                res.json({ message: "Invalid Props" }).writeHead(400);
                res.end();
            }
            if (status && (status !== "PLANNED" && status !== "IN_PROGRESS" && status !== "DONE" && status !== "BLOCKED")) {
                res.json({ message: "Invalid Status" }).writeHead(400);
                res.end();
            }
            const client = new MongoClient(uri, { useNewUrlParser: true });
            client.connect(async err => {
                let skips = pageSize * (pageNr - 1);
                skips = skips > 0 ? skips : 0;
                const collection = client.db("todo").collection("todos");
                const reg = new RegExp(key);
                if (status) {
                    const response = await collection.find<Todo>({ status, title: reg || /./ }).skip(skips).limit(pageSize).toArray();
                    res.json(response);
                } else {
                    const response = await collection.find<Todo>({ title: reg || /./ }).skip(skips).limit(pageSize).toArray();
                    res.json(response);
                }
                client.close();
            });
        });
    todoRouter.route('/getTodosByStatus')
        .post((req, res) => {
            const { status } = req.body;
            if (status === "PLANNED" || status === "IN_PROGRESS" || status === "DONE" || status === "BLOCKED") {
                const client = new MongoClient(uri, { useNewUrlParser: true });
                client.connect(async err => {
                    const collection = client.db("todo").collection("todos");
                    const response = await collection.find({ status }).toArray();
                    res.json(response);
                    client.close();
                });
            } else {
                res.writeHead(400);
                res.end();
            }
        });
    todoRouter.route('/addTodo')
        .post((req, res) => {
            const { title, responsable, dueDate } = req.body;
            // some bs way but fuck it
            if (!title || !responsable || !dueDate || typeof title !== "string" || typeof responsable !== "string" || !moment(dueDate, moment.ISO_8601, true).isValid()) {
                res.writeHead(400)
                res.write("Missing props");
                res.end();
            } else {
                const client = new MongoClient(uri, { useNewUrlParser: true });
                client.connect(async err => {
                    const collection = client.db("todo").collection("todos");
                    const sendDate = moment(dueDate).format();
                    const newTask: Todo = { title, responsable, dueDate:moment(dueDate).toDate(), status: "PLANNED" };
                    const response = await collection.insertOne(newTask);
                    res.json(response.ops[0]);
                    client.close();
                });
            }
        });
    todoRouter.route("/updateTodoStatus/:id")
        .post((req, res) => {
            const { status } = req.body;
            const id = req.params.id;
            if (ObjectID.isValid(id) && (status === "PLANNED" || status === "IN_PROGRESS" || status === "DONE" || status === "BLOCKED")) {
                const client = new MongoClient(uri, { useNewUrlParser: true });
                client.connect(async err => {
                    const collection = client.db("todo").collection("todos");
                    const obj = { _id: new ObjectID(id) };
                    let send = {}
                    if (status === "DONE") {
                        const date = moment().format();
                        send = { $set: { status, finishedDate: date } }
                        // Object.defineProperty(send.$set, "finnishedDate", { value: date });
                    } else {
                        send = { $set: { status } }
                    }
                    const response = await collection.updateOne(obj, send);
                    if (response === null) {
                        res.json({});
                    }
                    else {
                        res.json({ message: "Status updated" });
                    }
                    client.close();
                });
            } else {
                res.writeHead(400);
                res.end();
            }
        });
    todoRouter.route('/getTodoById/:id')
        .get((req, res) => {
            const id = req.params.id;
            if (!ObjectID.isValid(id)) {
                res.writeHead(400);
                res.end();
            } else {
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
        });
    todoRouter.route('/deleteTodo/:id')
        .delete((req, res) => {
            const id = req.params.id;
            if (!ObjectID.isValid(id)) {
                res.writeHead(400);
                res.end();
            } else {
                const client = new MongoClient(uri, { useNewUrlParser: true });
                client.connect(async err => {
                    const collection = client.db("todo").collection("todos");
                    const obj = { _id: new ObjectID(id) };
                    const response = await collection.deleteOne(obj);
                    console.log(response.deletedCount);
                    if (response.deletedCount! < 1) {
                        res.status(404).json({ message: "Object was not found in db" }).send();
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