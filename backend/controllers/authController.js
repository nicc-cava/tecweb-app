import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { Op } from 'sequelize';

/******************************************************* REGISTRATION *********************************************************/

export const register = async (req, res) => {
    try {
        const {username, password} = req.body;

        const existingUser = await User.findOne({where: {username}});
        if (existingUser) {
            return res.status(400).json({error: "Username already been taken."});
        }

        const salt = await bcrypt.genSalt(10); // The salt string is concatenated to the password to grant that two identical passwords have different hash codes
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username: username,
            password: hashedPassword
        });

        req.session.isAuthenticated = true;
        req.session.userId = newUser.id;
        req.session.username = newUser.username;

        res.status(201).json({ 
            message: "Registration completed with success.",
            user: { id: newUser.id, username: newUser.username }
        });

    } catch(error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

/********************************************************** LOGIN ************************************************************/

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({where: {username}});
        if (!user) {
            return res.status(401).json({error: "Credentials are not valid."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({error: "Credentials are not valid."});
        }

        req.session.isAuthenticated = true;
        req.session.userId = user.id;
        req.session.username = user.username;

        res.status(200).json({ 
            message: "Login completed with success.",
            user: {id: user.id, username: user.username}
        });

    } catch(error) {
        console.error("Error during login:", error);
        res.status(500).json({error: "Internal server error."});
    }
};

/********************************************************* LOGOUT ************************************************************/


export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({error: "Error during logout."});
        }
        res.clearCookie('connect.sid');
        res.status(200).json({message: "Logout completed with success."});
    });
};

/******************************************************* UTILITIES ***********************************************************/


export const getProfile = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'avatar']
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { avatar } = req.body;
        
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        await User.update({ avatar }, { where: { id: userId } });
        
        res.status(200).json({ message: "Avatar updated successfully", avatar });
    } catch (error) {
        console.error("Update Avatar Error:", error);
        res.status(500).json({ error: "Error updating avatar" });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                attemptsCount: {
                    [Op.gt]: 0
                }
            },
            attributes: ['id', 'username', 'avatar', 'solvedCount', 'attemptsCount'],
            order: [
                ['solvedCount', 'DESC'],
                ['attemptsCount', 'ASC']
            ],
            limit: 10
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
