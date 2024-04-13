import cors from 'cors';
import express from "express";
import dotenv from "dotenv";
import {MongoClient} from 'mongodb';

dotenv.config();

const API = express();
const port = process.env.PORT;

const API_URI = process.env.MONGODB_URI || '';
const dbClient = new MongoClient(API_URI);

const database = dbClient.db('rsvp-list');
const invites = database.collection('invites');

const retrieveRSVP = async (rsvpCode) => {
    try {
        const query = {
            "code": rsvpCode
        };

        const rsvp = await invites.findOne(query);

        return JSON.stringify(rsvp);
    } catch(error) {
        console.log(error);
        return 'error';
    }
};

const submitRSVP = async (rsvpCode, rsvpResponse) => {
    try {
        const query = {
            "code": rsvpCode
        };

        const response = {
            $set: {
                "attending": rsvpResponse
            }
        };

        const databaseResponse = await invites.updateOne(query, response);

        return databaseResponse;
    } catch(error) {
        console.log(error);
        return 'error';
    }
};

API.use(cors());


API.use(express.static('public'));

API.get('/retrieveRSVP', async (req, res) => {
    const rsvpCode = req.query.rsvpCode || '';
    const dbClientResponse = await retrieveRSVP(rsvpCode);

    res.send(dbClientResponse).status(dbClientResponse === 'error' ? 500 : 200);
});

API.patch('/submitRSVP', async (req, res) => {
    const rsvpCode = req.query.rsvpCode || '';
    const rsvpResponse = req.query.rsvpResponse || '';

    const databaseResponse = await submitRSVP(rsvpCode, rsvpResponse);

    res.send(databaseResponse).status(databaseResponse === 'error' ? 500 : 200);
});

API.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});