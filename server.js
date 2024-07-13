const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

const razorpay = new Razorpay({
    key_id: 'rzp_test_jg9oLeJD1FfZNT',
    key_secret: '2IHvlgNMDkW2JyKTWckwcTqA'
});

app.post('/create-order', async (req, res) => {
    const { amount, currency, receipt } = req.body;
    const options = {
        amount: amount, // amount in the smallest currency unit
        currency: currency,
        receipt: receipt
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/amount-details/:paymentId', async (req, res) => {
    const { paymentId } = req.params;
    try {
        const payment = await razorpay.payments.fetch(paymentId);
        res.json({ amount: payment.amount / 100, currency: payment.currency });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
