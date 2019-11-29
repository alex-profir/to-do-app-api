import express from 'express';
import chalk from 'chalk';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import authRouter from './routes/authRoute';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passportConfig from './config/passport';
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "Whatever" }));

passportConfig(app);

app.use(express.static(path.join(__dirname, '../public/')));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRouter);
app.get('/stuff', (req, res) => {
    res.json({
        message: "Hello there",
    });
});
app.get('/', (req, res) => {
    res.redirect('/swagger');
});

app.listen(port, () => console.log(`Server running on port:  ${chalk.green(port)}`));