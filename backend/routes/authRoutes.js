import express from 'express';
import {register, login, logout, getProfile, updateAvatar, getLeaderboard} from '../controllers/authController.js';
import {requireAuth} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', requireAuth, getProfile);
router.put('/avatar', requireAuth, updateAvatar);
router.get('/leaderboard', getLeaderboard);

export default router;
