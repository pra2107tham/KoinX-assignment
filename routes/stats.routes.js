import express from 'express';
import CryptoLatest from '../models/cryptoLatest.js';
import logger from '../logger.js'; // Import the Winston logger

const router = express.Router();

// /stats API to fetch latest cryptocurrency stats
router.get('/stats', async (req, res) => {
    const { coin } = req.query;

    // Validate the coin parameter
    if (!coin) {
        logger.warn('Coin parameter is missing from the request.');
        return res.status(400).json({ message: 'Coin parameter is required.' });
    }

    try {
        // Fetch the latest record of the requested coin
        const cryptoData = await CryptoLatest.findOne({ name: coin }).sort({ _id: -1 });

        // If no data found for the requested coin
        if (!cryptoData) {
            logger.info(`No data found for cryptocurrency: ${coin}`);
            return res.status(404).json({ message: `No data found for cryptocurrency: ${coin}` });
        }

        // Log successful data retrieval
        logger.info(`Fetched stats for ${coin}`);

        // Prepare the response data
        const response = {
            price: cryptoData.price,
            marketCap: cryptoData.marketCap,
            "24hChange": cryptoData.change24h
        };

        // Send the response
        return res.status(200).json(response);
    } catch (error) {
        // Log the error with a proper error level
        logger.error(`Error fetching stats for ${coin}: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
