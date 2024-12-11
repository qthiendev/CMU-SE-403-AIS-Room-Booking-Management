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
const { createPool } = require('generic-pool');

dotenv.config();
const app = express();
const PORT = 5000;
const numCores = os.cpus().length;

let useRedis = true;

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379',
    socket: {
        reconnectStrategy: (retries) => {
            console.error(`[${now.toLocaleString()}] Redis connection attempt ${retries}`);
            return retries > 3 ? new Error('Retry limit reached') : 1000; // Retry 3 times
        },
    },
});

async function connectRedis() {
    try {
        await redisClient.connect();
        monitorRedis(); // Start monitoring Redis events
    } catch (err) {
        console.error(`[${now.toLocaleString()}] Failed to connect to Redis:`, err.message);
        useRedis = false;
    }
}

// Create Redis connection pool
const redisPool = createPool(
    {
        create: async () => {
            const client = redis.createClient({ url: 'redis://127.0.0.1:6379' });
            await client.connect();
            return client;
        },
        destroy: (client) => client.quit(),
    },
    {
        max: 20, // Maximum number of clients in the pool
        min: 5,  // Minimum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        acquireTimeoutMillis: 10000, // Timeout for acquiring a client
    }
);

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

function monitorRedis() {
    redisClient.on('error', (err) => {
        console.error(`[${now.toLocaleString()}] Redis error:`, err.message);
        handleCriticalFailure();
    });

    redisClient.on('end', () => {
        console.error(`[${now.toLocaleString()}] Redis connection lost.`);
        handleCriticalFailure();
    });
}

function handleCriticalFailure() {
    console.error(`[${now.toLocaleString()}] Critical error detected. Restarting server...`);
    process.exit(1); // Exit the process to trigger a restart
}

async function acquireRedisClient(req, res, next) {
    try {
        req.redisClient = await redisPool.acquire();
        next();
    } catch (err) {
        console.error(`[${now.toLocaleString()}] Failed to acquire Redis client:`, err.message);
        req.redisClient = null;
        next();
    }
}

async function releaseRedisClient(req, res, next) {
    if (req.redisClient) {
        await redisPool.release(req.redisClient);
        req.redisClient = null;
    }
    next();
}

function setupMiddleware(app) {
    app.use(limiter); // Apply rate limiting to all requests

    app.use(helmet(helmetOptions));
    app.use(cors(corsOptions));
    app.use(xss()); // Add xss-clean middleware
    app.use(hpp()); // Add hpp middleware
    app.use(compression()); // Add compression middleware

    app.use(cookieParser());

    // Session options
    const sessionOptions = {
        secret: 'Secret',
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
    } else {
        console.log(`[${now.toLocaleString()}] Falling back to in-memory session store.`);
    }

    // Middleware for sessions and parsing
    app.use(session(sessionOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Add Redis pool middleware
    app.use(acquireRedisClient);
    app.use(releaseRedisClient);
}

async function startApp() {
    await connectRedis();

    if (useRedis && cluster.isMaster) {
        console.clear();
        console.log(`[${now.toLocaleString()}] Master process running on PID: ${process.pid}`);

        for (let i = 0; i < numCores; i++) {
            const worker = cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`[${now.toLocaleString()}] Worker ${worker.process.pid} died. Respawning...`);
            cluster.fork();
        });
    } else {
        setupMiddleware(app);

        app.use('/', mainRouter);

        app.listen(PORT, () => {
            console.log(`[${now.toLocaleString()}] Worker process [PID: ${process.pid}] running on http://localhost:${PORT}`);
        });
    }
}

startApp();