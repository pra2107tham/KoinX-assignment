import express from 'express';
import Crypto from '../models/crypto.js';
import CryptoLatest from '../models/cryptoLatest.js';


const router = express.Router();

router.get('/stats/', async (req, res) => {
    const { coin } = req.query;

    // Validate that the coin parameter is provided
    if (!coin) {
        return res.status(400).json({ message: 'Coin parameter is required.' });
    }

    try {
        // Find the latest record of the requested coin in the database
        const cryptoData = await CryptoLatest.findOne({ name: coin}).sort({ _id: -1 });

        // Check if the requested coin exists in the database
        if (!cryptoData) {
            return res.status(404).json({ message: `No data found for cryptocurrency: ${coin}` });
        }

        // Prepare the response data
        const response = {
            price: cryptoData.price,
            marketCap: cryptoData.marketCap,
            "24hChange": cryptoData.change24h
        };

        // Send the response
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching crypto stats:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
