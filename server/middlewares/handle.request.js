const { Worker } = require('worker_threads');

const workers = [];
const MAX_WORKERS = require('os').cpus().length;

for (let i = 0; i < MAX_WORKERS; i++) {
    workers.push(new Worker('./utilities/worker.request.js'));
}

const handle = async (req, res, next) => {
    const task = `Request at ${new Date().toISOString()}`;
    const availableWorker = workers.find((worker) => worker.threadId);

    if (!availableWorker) 
        return res.status(503).json({ message: 'Server overloaded, try again later.' });
    
    availableWorker.once('message', (result) => {
        req.result = result;
        next();
    });

    availableWorker.postMessage(task);
}

module.exports = handle;
