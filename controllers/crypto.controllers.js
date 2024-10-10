import Crypto from "../models/crypto.js";
import axios from "axios";

const getAndSaveCrypto = async (req, res) => {
    const cryptoIds = ['bitcoin', 'matic-network', 'ethereum'];
    const cryptoToSave = []; // Collect cryptos to save

    try {
        for (const id of cryptoIds) {
            console.log(`Fetching data for ${id}...`);
            const options = {
                method: 'GET',
                url: `https://api.coingecko.com/api/v3/coins/${id}`,
                headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.KOINX }
            };

            const response = await axios.request(options);
            const cryptoData = response.data;

            // Check if required properties exist
            if (!cryptoData.market_data || !cryptoData.market_data.current_price) {
                console.error(`Data format error for ${id}:`, cryptoData);
                continue; // Skip this entry
            }

            // Prepare the crypto object for saving
            const cryptoObject = {
                name: cryptoData.name,
                symbol: cryptoData.symbol,
                price: cryptoData.market_data.current_price.usd,
                marketCap: cryptoData.market_data.market_cap.usd,
                change24h: cryptoData.market_data.price_change_percentage_24h
            };

            console.log(`Preparing to save crypto:`, cryptoObject);
            cryptoToSave.push(cryptoObject);
        }

        // Save all collected cryptos at once
        if (cryptoToSave.length > 0) {
            console.log(`Attempting to save ${cryptoToSave.length} cryptocurrencies:`, cryptoToSave);
            try {
                const savedCryptos = await Crypto.insertMany(cryptoToSave);
                console.log('Successfully saved cryptocurrencies:', savedCryptos);
            } catch (insertError) {
                console.error('Error saving cryptocurrencies:', insertError);
                return res.status(500).json({ message: 'Error saving cryptocurrencies to the database' });
            }
        } else {
            console.log('No cryptocurrencies to save.');
        }
        console.log('Cryptocurrencies saved successfully') 
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
};

export { getAndSaveCrypto };

