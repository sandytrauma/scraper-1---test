const express = require('express');
const request = require('request-promise');
const app = express();
const PORT = process.env.port || 5000;
const dotenv = require('dotenv');
dotenv.config();
const Api_Key = process.env.API_KEY;
const baseUrl = `http://api.scraperapi.com/?api_key=${Api_Key}&autoparse=true`;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the scraper API.');
});

app.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    const { type } = req.query;

    let url;

    switch (type) {
        case 'details':
            url = `https://www.amazon.com/dp/${productId}`;
            break;
        case 'reviews':
            url = `https://www.amazon.com/product-reviews/${productId}`;
            break;
        case 'offers':
            url = `https://www.amazon.com/gp/offer-listing/${productId}`;
            break;

        default:
            res.status(400).json({ error: 'Invalid type parameter.' });
            return;
    }

    try {
        const response = await request(`${baseUrl}&url=${url}`);
        res.json(JSON.parse(response));
    } catch (error) {
        res.json(error);
    }
});

app.get('/search/:searchQuery', async (req, res) => {
    const { searchQuery } = req.params;

    try {
        const response = await request(`${baseUrl}&url=https://www.amazon.com/s?k=${searchQuery}`);
        res.json(JSON.parse(response));
    } catch (error) {
        res.json(error);
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT} `));