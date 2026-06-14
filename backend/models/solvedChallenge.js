import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SolvedChallenge = sequelize.define('SolvedChallenge', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    challengeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default SolvedChallenge;
