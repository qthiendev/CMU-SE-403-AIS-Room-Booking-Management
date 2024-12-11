const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.setMaxListeners(200);

const axios = require('axios');

process.on('warning', (warning) => {
    if (warning.name === 'MaxListenersExceededWarning') {
        console.error(warning);
    }
});

async function testRateLimit() {
    const totalRequests = 200; // Adjust this number based on your rate limit settings
    const url = 'http://localhost:5000/';

    console.log(`Starting rate limit test with ${totalRequests} requests...`);

    const startTime = performance.now();

    const requests = Array.from({ length: totalRequests }, (_, index) =>
        axios.get(url).catch(error => {
            if (error.response && error.response.status === 429) {
                console.log(`Request ${index + 1} was rate limited.`);
            }
        })
    );

    try {
        await Promise.all(requests);

        const endTime = performance.now();
        const totalTime = endTime - startTime;

        console.log(`\nTotal execution time: ${totalTime.toFixed(2)}ms\n`);

    } catch (error) {
        console.error('\nError during rate limit test:', error.message);
    }
}

module.exports = testRateLimit();