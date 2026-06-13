import Challenge from '../models/challenge.js';
import User from '../models/user.js';

/*************************************************** CHALLENGE CREATION *****************************************************/

export const createChallenge = async (req, res) => {
    try {
        const {regex, positiveExample, negativeExample, positiveTestStrings, negativeTestStrings} = req.body;

        if (positiveTestStrings.length > 10 || negativeTestStrings.length > 10) {
            return res.status(400).json({ error: "Maximum 10 test strings per type."});
        }

        try {
            new RegExp(regex);
        } catch(e) {
            return res.status(400).json({error: "Secret regex is not syntactically valid."});
        }

        const newChallenge = await Challenge.create({
            regex,
            positiveExample,
            negativeExample,
            positiveTestStrings,
            negativeTestStrings,
            authorId: req.session.userId // Taken by the login
        });

        res.status(201).json({message: "Challenge created successfully!", challenge: newChallenge});

    } catch(error) {
        console.error("Error creating the challenge:", error);
        res.status(500).json({error: "Internal server error."});
    }
};

/*************************************************** CHALLENGES RETRIEVE *****************************************************/

export const getAllChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.findAll({
            attributes: {exclude: ['positiveTestStrings', 'negativeTestStrings', 'regex']},
            include: [{
                model: User,
                attributes: ['username']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(challenges);

    } catch(error) {
        console.error("Error retrieving challenges:", error);
        res.status(500).json({error: "Internal server error."});
    }
};

export const getChallengeById = async (req, res) => {
    try {
        const challengeId = req.params.id;
        
        const challenge = await Challenge.findByPk(challengeId, {
            attributes: ['id', 'positiveExample', 'negativeExample', 'createdAt'],
            include: [{
                model: User,
                attributes: ['username']
            }]
        });

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found." });
        }

        res.status(200).json(challenge);

    } catch(error) {
        console.error("Error retrieving challenge details:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

/************************************************** CHALLENGES RESOLUTION ****************************************************/

export const solveChallenge = async (req, res) => {
    try {
        const challengeId = req.params.id; // Taken from the URL
        const {proposedRegex} = req.body;

        let userRegex;
        try {
            userRegex = new RegExp(proposedRegex);
        } catch(e) {
            return res.status(400).json({error: "Your regex is invalid. Check the syntax."});
        }

        const challenge = await Challenge.findByPk(challengeId);
        if (!challenge) {
            return res.status(404).json({error: "Challenge not found."});
        }

        let positivePassed = 0;
        challenge.positiveTestStrings.forEach(str => {
            if (userRegex.test(str)) positivePassed++;
        });

        let negativePassed = 0;
        challenge.negativeTestStrings.forEach(str => {
            if (!userRegex.test(str)) negativePassed++;
        });

        const isVictorious = 
            (positivePassed === challenge.positiveTestStrings.length) &&
            (negativePassed === challenge.negativeTestStrings.length);


        res.status(200).json({
            success: isVictorious,
            results: {
                positivePassed,
                totalPositive: challenge.positiveTestStrings.length,
                negativePassed,
                totalNegative: challenge.negativeTestStrings.length
            },
            message: isVictorious ? "Congratulations! You solved the riddle!" : "You're almost there, try again!"
        });

    } catch(error) {
        console.error("Error resolving the challenge:", error);
        res.status(500).json({error: "Internal server error."});
    }
};
