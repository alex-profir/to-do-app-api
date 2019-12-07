import express from 'express';
import todos from './todos.json';
const todoRouter = express.Router();

todoRouter.route('/getTodos')
    .get((req, res) => {
        res.json(todos);
    });
export default todoRouter;