"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const user_json_1 = __importDefault(require("../../routes/user.json"));
const passport_local_1 = require("passport-local");
function localStragegy() {
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: 'email', passwordField: 'password'
    }, (email, password, done) => {
        if (email === user_json_1.default.email && password === user_json_1.default.password) {
            const user = {
                email, password
            };
            done(null, user);
        }
        else {
            done(null, false);
        }
    }));
}
exports.default = localStragegy;
