import axios from "axios";

const connectGecko = async () => {
    const options = {
      method: 'GET',
      url: 'https://api.coingecko.com/api/v3/ping',
      headers: { accept: 'application/json' , 'x-cg-demo-api-key': process.env.KOINX},
    };
  
    try {
      const response = await axios.request(options);
      console.log('Connected to CoinGecko:', response.data.gecko_says);
      return true;
    } catch (error) {
      console.error('Error connecting to CoinGecko:', error.message);
      throw error;
    }
  };

  export { connectGecko };