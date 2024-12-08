const axios = require('axios');
const { performance } = require('perf_hooks');

async function testLoginLogout() {
    const totalRequests = 10000;
    const urlLogin = 'http://localhost:5000/authen/login';

    console.log(`Starting test with ${totalRequests} login and logout requests...`);

    const startTime = performance.now();

    const requests = Array.from({ length: totalRequests }, async () => {
        try {
            const loginResponse = await axios.post(urlLogin, {
                account: 'admin',
                password: 'admin123',
            }, { withCredentials: true });

        } catch (error) {
            console.error('Error during login/logout:', error.message);
        }
    });

    try {
        await Promise.all(requests);

        const endTime = performance.now();
        const totalTime = endTime - startTime;

        console.log(`\nTotal execution time: ${totalTime.toFixed(2)}ms\n`);

    } catch (error) {
        console.error('\nError during test:', error.message);
    }
}

module.exports = testLoginLogout();
