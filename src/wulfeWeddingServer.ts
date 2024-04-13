import cors from 'cors';
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {MongoClient} from 'mongodb';
import { ParsedQs } from 'qs';  

dotenv.config();

const API: Express = express();
const port = process.env.PORT;

const API_URI = process.env.URI || '';
const dbClient = new MongoClient(API_URI);

const database = dbClient.db('rsvp-list');
const invites = database.collection('invites');

const retrieveRSVP = async (rsvpCode: string | ParsedQs | string[] | ParsedQs[]) => {
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

const submitRSVP = async (rsvpCode: string | ParsedQs | string[] | ParsedQs[], rsvpResponse: boolean | string | ParsedQs | string[] | ParsedQs[]) => {
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

API.get('/retrieveRSVP', async (req: Request, res: Response) => {
    const rsvpCode = req.query.rsvpCode || '';
    const dbClientResponse = await retrieveRSVP(rsvpCode);

    res.send(dbClientResponse).status(dbClientResponse === 'error' ? 500 : 200);
});

API.patch('/submitRSVP', async (req: Request, res: Response) => {
    const rsvpCode = req.query.rsvpCode || '';
    const rsvpResponse = req.query.rsvpResponse || '';

    const databaseResponse = await submitRSVP(rsvpCode, rsvpResponse);

    res.send(databaseResponse).status(databaseResponse === 'error' ? 500 : 200);
});

API.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});