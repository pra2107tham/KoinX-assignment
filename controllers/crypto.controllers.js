import Crypto from "../models/crypto.js";
import CryptoLatest from "../models/cryptoLatest.js"; 
import axios from "axios";
import logger from "../logger.js"; // Import Winston logger

const getAndSaveCrypto = async (req, res) => {
    const cryptoIds = ['bitcoin', 'matic-network', 'ethereum'];
    const cryptoToSave = []; 

    try {
        for (const id of cryptoIds) {
            logger.info(`Fetching data for ${id}...`);
            const options = {
                method: 'GET',
                url: `https://api.coingecko.com/api/v3/coins/${id}`,
                headers: { 
                    accept: 'application/json', 
                    'x-cg-demo-api-key': process.env.KOINX 
                }
            };

            const response = await axios.request(options);
            const cryptoData = response.data;

            // Check if required properties exist
            if (!cryptoData.market_data || !cryptoData.market_data.current_price) {
                logger.warn(`Data format error for ${id}: ${JSON.stringify(cryptoData)}`);
                continue;
            }

            // Prepare the crypto object for saving
            const cryptoObject = {
                name: cryptoData.name.toLowerCase(),
                symbol: cryptoData.symbol,
                price: cryptoData.market_data.current_price.usd,
                marketCap: cryptoData.market_data.market_cap.usd,
                change24h: cryptoData.market_data.price_change_percentage_24h
            };

            logger.info(`Prepared crypto data for saving: ${JSON.stringify(cryptoObject)}`);
            cryptoToSave.push(cryptoObject);

            // Update or create the latest cryptocurrency data
            await CryptoLatest.findOneAndUpdate(
                { symbol: cryptoObject.symbol },  // Match by symbol
                { $set: cryptoObject },           // Update with new data
                { upsert: true, new: true }       // Create a new document if it doesn't exist
            );
            logger.info(`Updated latest data for ${cryptoObject.name}`);
        }

        // Save all collected cryptos to historical data collection
        if (cryptoToSave.length > 0) {
            logger.info(`Attempting to save ${cryptoToSave.length} cryptocurrencies.`);
            try {
                const savedCryptos = await Crypto.insertMany(cryptoToSave);
                logger.info('Successfully saved historical cryptocurrencies:', savedCryptos);
            } catch (insertError) {
                logger.error('Error saving cryptocurrencies to the database:', insertError);
                return res.status(500).json({ message: 'Error saving cryptocurrencies to the database' });
            }
        } else {
            logger.info('No cryptocurrencies to save.');
        }
        
        logger.info('Cryptocurrencies saved successfully');
        return res.status(200).json({ message: 'Cryptocurrency data fetched and saved successfully' });
    } catch (error) {
        logger.error('Error fetching or saving crypto data:', error);
        return res.status(500).json({ message: 'Error fetching or saving crypto data' });
    }
};

export { getAndSaveCrypto };