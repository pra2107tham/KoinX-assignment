import express from 'express';
import Crypto from '../models/crypto.js'; // Use the existing Crypto model to get historical data

const router = express.Router();

// /deviation API to return the standard deviation of the price for the requested cryptocurrency
router.get('/deviation', async (req, res) => {
    const { coin } = req.query; // Extract the coin from query parameters

    // Ensure the coin query parameter is provided
    if (!coin) {
        return res.status(400).json({ message: 'Coin query parameter is required.' });
    }

    const coinLower = coin.toLowerCase();

    try {
        // Retrieve the last 100 records for the specified cryptocurrency from the Crypto collection
        const cryptoRecords = await Crypto.find(
            { name: coinLower },
            { price: 1 } // Only select the price field
        )
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (latest first)
        .limit(100); // Limit to the last 100 records

        // Check if there are enough records to calculate the standard deviation
        if (cryptoRecords.length === 0) {
            return res.status(404).json({ message: `No data found for cryptocurrency: ${coin}` });
        }

        // Extract the prices from the records
        const prices = cryptoRecords.map(record => record.price);

        // Calculate the mean (average) price
        const meanPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

        // Calculate the variance
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - meanPrice, 2), 0) / prices.length;

        // Calculate the standard deviation (square root of variance)
        const standardDeviation = Math.sqrt(variance);

        // Return the standard deviation rounded to 2 decimal places
        return res.status(200).json({
            deviation: standardDeviation.toFixed(2)
        });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
