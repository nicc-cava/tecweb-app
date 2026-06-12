import {Sequelize} from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false // Prevents SQL queries from showing up in the terminal
});

export default sequelize;
