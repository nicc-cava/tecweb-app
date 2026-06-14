import {DataTypes, DATE} from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.TEXT
    },
    solvedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    attemptsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

export default User;
