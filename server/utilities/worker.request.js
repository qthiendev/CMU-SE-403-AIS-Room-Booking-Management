const { parentPort } = require('worker_threads');

parentPort.on('message', (task) => {
    const result = `Processed task: ${task}`;
    parentPort.postMessage(result);
});
