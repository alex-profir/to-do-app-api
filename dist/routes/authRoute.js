"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_json_1 = __importDefault(require("./user.json"));
const passport_1 = __importDefault(require("passport"));
const authRouter = express_1.default.Router();
authRouter.route('/getUser')
    .all((req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.redirect('/');
        res.writeHead(401);
    }
})
    .get((req, res) => {
    res.json(user_json_1.default);
});
authRouter.route('/login')
    .post(passport_1.default.authenticate('local'), (req, res) => {
    res.json(user_json_1.default);
});
exports.default = authRouter;
