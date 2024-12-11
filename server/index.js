const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redis = require('redis');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mainRouter = require('./routes/main.route');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');
const cluster = require('cluster');
const os = require('os');
const now = new Date();

const app = express();
const PORT = 5000;
const numCores = os.cpus().length;

let useRedis = true;

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

const helmetOptions = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "http://localhost:5173"],
        },
    },
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter); // Apply rate limiting to all requests

app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(xss()); // Add xss-clean middleware
app.use(hpp()); // Add hpp middleware
app.use(compression()); // Add compression middleware

app.use(cookieParser());

    // Logging middleware
    // app.use((req, res, next) => {
    //     console.log(`[${now.toLocaleString()}] [PID: ${process.pid}] ${req.method} ${req.url}`);
    //     next();
    // });

    // Session options
    const sessionOptions = {
        secret: 'NavCareerProject',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    };

    if (useRedis) {
        const store = new RedisStore({ client: redisClient });
        sessionOptions.store = store;
        console.log(`[${now.toLocaleString()}] Using Redis as session store.`);
    } else {
        console.log(`[${now.toLocaleString()}] Falling back to in-memory session store.`);
    }

    // Middleware for sessions and parsing
    app.use(session(sessionOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Middleware to set default session role
    app.use((req, res, next) => {
        if (!req.session.role) {
            req.session.role = 'NAV_GUEST';
        }
        next();
    });
}

async function startApp() {
    await connectRedis();

    if (useRedis && cluster.isMaster) {
        console.clear();
        console.log(`[${now.toLocaleString()}] Master process running on PID: ${process.pid}`);

        for (let i = 0; i < numCores; i++) {
            const worker = cluster.fork();
            console.log(`Forked worker with PID: ${worker.process.pid}`);
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`[${now.toLocaleString()}] Worker ${worker.process.pid} died. Respawning...`);
            cluster.fork();
        });
    } else {
        setupMiddleware(app);

        app.use('/', require('./routes/main.route'));

        app.listen(PORT, () => {
            console.log(`[${now.toLocaleString()}] Worker process [PID: ${process.pid}] running on http://localhost:${PORT}`);
        });
    }
}

startApp();
