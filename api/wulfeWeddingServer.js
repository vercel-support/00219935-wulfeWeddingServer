"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
const API = (0, express_1.default)();
const port = process.env.PORT;
const API_URI = process.env.URI || '';
const dbClient = new mongodb_1.MongoClient(API_URI);
const database = dbClient.db('rsvp-list');
const invites = database.collection('invites');
const retrieveRSVP = (rsvpCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            "code": rsvpCode
        };
        const rsvp = yield invites.findOne(query);
        return JSON.stringify(rsvp);
    }
    catch (error) {
        console.log(error);
        return 'error';
    }
});
const submitRSVP = (rsvpCode, rsvpResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            "code": rsvpCode
        };
        const response = {
            $set: {
                "attending": rsvpResponse
            }
        };
        const databaseResponse = yield invites.updateOne(query, response);
        return databaseResponse;
    }
    catch (error) {
        console.log(error);
        return 'error';
    }
});
API.use((0, cors_1.default)());
API.use(express_1.default.static('public'));
API.get('/retrieveRSVP', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rsvpCode = req.query.rsvpCode || '';
    const dbClientResponse = yield retrieveRSVP(rsvpCode);
    res.send(dbClientResponse).status(dbClientResponse === 'error' ? 500 : 200);
}));
API.patch('/submitRSVP', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rsvpCode = req.query.rsvpCode || '';
    const rsvpResponse = req.query.rsvpResponse || '';
    const databaseResponse = yield submitRSVP(rsvpCode, rsvpResponse);
    res.send(databaseResponse).status(databaseResponse === 'error' ? 500 : 200);
}));
API.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
