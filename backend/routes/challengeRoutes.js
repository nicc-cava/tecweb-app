import express from 'express';
import {createChallenge, getAllChallenges, solveChallenge, getChallengeById} from '../controllers/challengeController.js';
import {requireAuth} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllChallenges);
router.post('/', requireAuth, createChallenge);
router.get('/:id', requireAuth, getChallengeById);
router.post('/:id/solve', requireAuth, solveChallenge);

export default router;
