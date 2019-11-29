"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const debug_1 = __importDefault(require("debug"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(morgan_1.default('tiny'));
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '/views/index.html'));
});
app.listen(port, () => debug_1.default(`Server running on port:  ${chalk_1.default.green(port)}`));
