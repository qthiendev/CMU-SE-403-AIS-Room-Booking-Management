const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const mainRouter = require('./routes/main.route');
const now = new Date();

dotenv.config();

const app = express();
const PORT = 5000;

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (req.session) {
        req.session.cookie.expires = new Date(Date.now() + 15 * 60 * 1000);
        req.session.cookie.maxAge = 15 * 60 * 1000;
    }
    next();
});

app.use('/', mainRouter);

app.listen(PORT, () => {
    console.clear();
    console.log('\x1b[32m%s\x1b[0m', `[${now.toLocaleString()}] at index.js | SERVER running on http://localhost:${PORT}`);
    console.log('\x1b[32m%s\x1b[0m', `[${now.toLocaleString()}] at index.js | CLIENT running on ${corsOptions.origin}`);
    //console.log('\x1b[31m%s\x1b[0m', 'This is red text');
    //console.log('\x1b[32m%s\x1b[0m', 'This is green text');
    //console.log('\x1b[34m%s\x1b[0m', 'This is blue text');
    //console.log('\x1b[33m%s\x1b[0m', 'This is yellow text');
    //console.log('\x1b[1m%s\x1b[0m', 'This is bold text');
});
