const axios = require('axios');
const { performance } = require('perf_hooks');

async function testRequests() {
    const totalRequests = 10000;
    const url = 'http://localhost:5000/';

    console.log(`Starting test with ${totalRequests} concurrent requests...`);

    const startTime = performance.now();

    const requests = Array.from({ length: totalRequests }, () => axios.get(url));

    try {
        const responses = await Promise.all(requests);

        const endTime = performance.now();
        const totalTime = endTime - startTime;

        console.log(`\nTotal execution time: ${totalTime.toFixed(2)}ms\n`);

    } catch (error) {
        console.error('\nError during test:', error.message);
    }
}

module.exports = testRequests();
