import express from 'express';
import {createChallenge, getAllChallenges, solveChallenge} from '../controllers/challengeController.js';
import {requireAuth} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllChallenges);

router.post('/', requireAuth, createChallenge);

router.post('/:id/solve', requireAuth, solveChallenge);

export default router;
