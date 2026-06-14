/******************************************************* MODULES *********************************************************/

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import 'dotenv/config';

/**************************************************** CUSTOM MODULES *****************************************************/

import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js'; 
import challengeRoutes from './routes/challengeRoutes.js';
import User from './models/user.js';
import Challenge from './models/challenge.js';
import SolvedChallenge from './models/solvedChallenge.js';

/******************************************************** SETUP **********************************************************/

const app = express();
const PORT = process.env.PORT;

/***************************************************** MIDDLEWARES *******************************************************/

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true // Allows session cookie exchange between ports
}))

// The json size limit allows to upload images as avatars
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Prevents the server from saving unchanged sessions
    saveUninitialized: false, // Prevents the server from creating sessions for users who have not provided any data
    cookie: { 
        secure: false,
        httpOnly: true // Cookie is not readable by any browser JavaScript code (it prevents XSS)
    }
}));

/******************************************************* ROUTING *********************************************************/

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.get('/', (req, res) => {
    res.json({message: "Welcome to RegexRiddle's API!"});
});

/******************************************** DATABASE SYNC AND SERVER START *********************************************/

User.hasMany(Challenge, {foreignKey: 'authorId'});
Challenge.belongsTo(User, {foreignKey: 'authorId'});
User.belongsToMany(Challenge, { 
    through: SolvedChallenge, 
    as: 'Solved',
    foreignKey: 'userId',
    otherKey: 'challengeId'
});
Challenge.belongsToMany(User, { 
    through: SolvedChallenge, 
    as: 'Solvers',
    foreignKey: 'challengeId',
    otherKey: 'userId'
});

sequelize.sync()
    .then(() => {
        console.log("Database syncronization was successfull.");
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error during database syncronization: ", error);
    });
