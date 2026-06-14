import express from 'express';
import {register, login, logout, getProfile, updateAvatar} from '../controllers/authController.js';
import {requireAuth} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', requireAuth, getProfile);
router.put('/avatar', requireAuth, updateAvatar);

export default router;
