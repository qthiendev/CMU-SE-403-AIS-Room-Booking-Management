const axios = require('axios');
const { performance } = require('perf_hooks');

async function testLoginLogout(concurrentRequests = 1000) {
    const urlLogin = 'http://localhost:5000/authen/login';

    console.log(`Starting test with ${concurrentRequests} simultaneous login requests...`);

    const startTime = performance.now();

    let successfulRequests = 0;
    let failedRequests = 0;

    const requests = [];
    for (let i = 0; i < concurrentRequests; i++) {
        requests.push(
            axios
                .post(
                    urlLogin,
                    { account: 'admin', password: 'admin123' },
                    { withCredentials: true }
                )
                .then(() => successfulRequests++)
                .catch(() => failedRequests++)
        );
    }

    try {
        await Promise.all(requests);
        const endTime = performance.now();
        const totalTime = endTime - startTime;

        console.log(`Total execution time: ${totalTime.toFixed(2)}ms`);
        console.log(`Successful requests: ${successfulRequests}`);
        console.log(`Failed requests: ${failedRequests}`);
    } catch (error) {
        console.error('\nUnexpected error:', error.message);
    }
}

// Run the function with desired concurrency
testLoginLogout(10000);