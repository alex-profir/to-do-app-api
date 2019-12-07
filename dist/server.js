"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./swagger.json"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./config/passport"));
const todoRoute_1 = __importDefault(require("./routes/todoRoute"));
const app = express_1.default();
const port = process.env.PORT || 4000;
app.use(morgan_1.default('tiny'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_session_1.default({ secret: "Whatever" }));
passport_1.default(app);
app.use(express_1.default.static(path_1.default.join(__dirname, '../public/')));
app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use('/auth', authRoute_1.default);
app.use('/todo', todoRoute_1.default);
app.get('/stuff', (req, res) => {
    res.json({
        message: "Hello there",
    });
});
app.get('/', (req, res) => {
    res.redirect('/swagger');
});
app.listen(port, () => console.log(`Server running on port:  ${chalk_1.default.green(port)}`));
