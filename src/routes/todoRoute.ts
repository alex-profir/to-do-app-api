import express from 'express';
import todos from './todos.json';
import fs from 'fs';
const todoRouter = express.Router();

todoRouter.route('/getTodos')
    // .all((req, res, next) => {
    //     if (req.user) {
    //         next();
    //     } else {
    //         res.status(401).send()
    //     }
    // })
    .get((req, res) => {
        res.json(todos);
    });
todoRouter.route('/addTodo')
    // .all((req, res, next) => {
    //     if (req.user) {
    //         next();
    //     } else {
    //         res.status(401).send()
    //     }
    // })
    .post((req, res) => {
        const { task, who, dueDate, done } = req.body;
        // some bs way but fuck it
        if (!task || !who || !dueDate || !done || typeof done !== "boolean" || typeof task !== "string" || typeof who !== "string" || typeof dueDate !== "string") {
            res.writeHead(400)
            res.write("Missing props");
            res.end();
        }
        const id = todos[todos.length - 1].id;
        const newTask = { id: id + 1, task, who, dueDate, done };

        todos.push(newTask);
        const data = JSON.stringify(todos, null, 2);
        fs.writeFile(__dirname + "/todos.json", data, err => {
            if (err) {
                res.writeHead(500)
                res.write(err.message);
                res.end();
            } else {
                res.writeHead(200);
                res.end();
            }
        });
    });
todoRouter.route('/getTodoById/:id')
    // .all((req, res, next) => {
    //     if (req.user) {
    //         next();
    //     } else {
    //         res.status(401).send()
    //     }
    // })
    .get((req, res) => {
        const id = parseInt(req.params.id, 10);
        const stuff = todos.filter(e => e.id === id);
        if (stuff.length) {
            res.json(stuff[0]);
        } else {
            res.writeHead(404);
            res.end();
        }
    })
todoRouter.route('/deleteTodo/:id')
    // .all((req, res, next) => {
    //     if (req.user) {
    //         next();
    //     } else {
    //         res.status(401).send()
    //     }
    // })
    .delete((req, res) => {
        const id = parseInt(req.params.id, 10);
        const stuff = todos.filter(e => e.id === id);
        if (stuff.length === 0) {
            res.writeHead(404);
            res.end();
        }
        const newArray = todos.filter(e => e !== stuff[0]);
        const data = JSON.stringify(newArray, null, 2);
        fs.writeFile(__dirname + "/todos.json", data, err => {
            if (err) {
                res.writeHead(500)
                res.write(err.message);
                res.end();
            } else {
                res.writeHead(200);
                res.end();
            }
        });
    })
export default todoRouter;