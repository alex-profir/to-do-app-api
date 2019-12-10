import express from 'express';
import chalk from 'chalk';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors'
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import authRouter from './routes/authRoute';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passportConfig from './config/passport';
import todoRouter from './routes/todoRoute';
const app = express();
const port = process.env.PORT || 4000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "Whatever" }));
app.use(cors());
passportConfig(app);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRouter());
app.use('/todo', todoRouter());
app.get('/stuff', (req, res) => {
    res.json({
        message: "Hello there",
    });
});
app.get('/', (req, res) => {
    res.redirect('/swagger');
});

app.listen(port, () => console.log(`Server running on port:  ${chalk.green(port)}`));