const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurable window size
const windowSize = 10;
let storedNumbers = [];

// Function to generate Fibonacci sequence up to a certain length
function generateFibonacci(length) {
    const fibo = [0, 1];
    for (let i = 2; i < length; i++) {
        fibo[i] = fibo[i - 1] + fibo[i - 2];
    }
    return fibo.slice(0, length);
}

// Function to generate even numbers up to a certain limit
function generateEvenNumbers(limit) {
    const evens = [];
    for (let i = 2; i <= limit; i += 2) {
        evens.push(i);
    }
    return evens;
}

// Function to generate random numbers within a range
function generateRandomNumbers(count, min, max) {
    const randoms = [];
    for (let i = 0; i < count; i++) {
        randoms.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return randoms;
}

// Mock function to simulate fetching numbers from third-party API
const fetchNumbersFromAPI = async (numberid) => {
    // Simulate different number sets based on the numberid
    switch (numberid) {
        case 'p': // Prime numbers (mock not implemented here, adjust as per actual API)
            return [];
        case 'f': // Fibonacci numbers (up to 10)
            return generateFibonacci(10);
        case 'e': // Even numbers (up to 20)
            return generateEvenNumbers(20);
        case 'r': // Random numbers (10 random numbers between 1 and 100)
            return generateRandomNumbers(10, 1, 100);
        default:
            return [];
    }
};

// API endpoint to fetch numbers
app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;

    // Validate numberid
    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    try {
        // Fetch numbers from the third-party server (mock function used here)
        const newNumbers = await fetchNumbersFromAPI(numberid);
        const uniqueNewNumbers = newNumbers.filter(num => !storedNumbers.includes(num));
        const prevState = [...storedNumbers];

        // Update stored numbers
        storedNumbers = [...storedNumbers, ...uniqueNewNumbers].slice(-windowSize);

        // Calculate average
        const average = storedNumbers.length > 0 ? storedNumbers.reduce((a, b) => a + b, 0) / storedNumbers.length : 0;

        // Format response
        res.json({
            windowPrevState: prevState,
            windowCurrState: storedNumbers,
            fetchedNumbers: uniqueNewNumbers,
            average: average.toFixed(2)
        });

    } catch (error) {
        // Handle errors and timeouts
        res.status(500).json({ error: 'Error fetching numbers' });
    }
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
