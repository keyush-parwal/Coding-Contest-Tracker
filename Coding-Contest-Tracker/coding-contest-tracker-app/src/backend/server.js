const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS for all routes

// Route handler for the root URL
app.get('/', (req, res) => {
    res.send('Server is running successfully.'); // You can customize this response message
});

app.use('/clist-proxy', async (req, res) => {
    const clistUrl = `https://clist.by/api/v1/contest/?format=json&username=akshat202002&api_key=${process.env.CLIST_API_KEY}${req.url}`;
    const clistMethod = req.method === 'GET' || req.method === 'HEAD' ? 'GET' : req.method;

    try {
        const clistResponse = await fetch(clistUrl, {
            method: clistMethod,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `ApiKey akshat202002:a6baab8eb3f772ee443e2778f985f6f944ca3295`,
                // Add any other headers you need
            },
            body: clistMethod !== 'GET' ? JSON.stringify(req.body) : undefined,
        });

        if (!clistResponse.ok) {
            throw new Error(`Failed to fetch data from clist.by API. Status: ${clistResponse.status}`);
        }

        const clistData = await clistResponse.json();
        console.log("clistData", clistData);

        res.json(clistData); // Send the entire clistData
        console.log("clistData sent");
    } catch (error) {
        console.error('Error proxying clist.by API:', error);
        res.status(500).json({ success: false, message: 'Failed to proxy clist.by API', error: error.message });
    }
});



// Use a dedicated SMTP provider like SendGrid or Mailgun
const transporter = nodemailer.createTransport({
    pool: true, // Use a pool of connections
    maxConnections: 20, // Set maximum number of connections (adjust as per your system's capacity)
    service: 'gmail',
    auth: {
        user: 'vqakkms@gmail.com',
        pass: process.env.GMAIL_PASSWORD,
    },
});

app.post('/send-email', (req, res) => {
    const { email, subject, message } = req.body;

    const mailOptions = {
        from: 'vqakkms@gmail.com',
        to: email,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to send email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ success: true, message: 'Email sent successfully' });
        }
    });
});

const PORT = process.env.PORT || 3001; // Use the PORT environment variable if available, otherwise use port 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
