import {DataTypes, DATE} from 'sequelize';
import sequelize from '../config/database.js';

const Challenge = sequelize.define('Challenge', {
    regex: {
        type: DataTypes.STRING,
        allowNull: false
    },
    positiveExample: {
        type: DataTypes.STRING,
        allowNull: false
    },
    negativeExample: {
        type: DataTypes.STRING,
        allowNull: false
    },
    positiveTestStrings: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    negativeTestStrings: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    }
})

export default Challenge;
