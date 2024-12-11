const axios = require('axios');
const { randomInt } = require('crypto');
const { performance } = require('perf_hooks');

async function testLoginLogout(concurrentRequests = 1000) {

    console.log(`Starting test with ${concurrentRequests} simultaneous login requests...`);

    const startTime = performance.now();

    let successfulRequests = 0;
    let failedRequests = 0;

    const requests = [];
    for (let i = 0; i < concurrentRequests; i++) {
        let rand = Math.random();
        const urlLogin = `http://localhost:5000/room/search?index=${rand}`;
        requests.push(
            axios
                .get(urlLogin, { withCredentials: true })
                .then((i) => {
                    successfulRequests++;
                    console.log(i++);
                })
                .catch(() => {
                    failedRequests++;
                })
        );
    }

    try {
        const response = await Promise.all(requests);
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
testLoginLogout(200);  // Change this to a lower number, like 1000 or less, to avoid overload
