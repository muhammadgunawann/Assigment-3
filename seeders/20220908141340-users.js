'use strict';

const { hash } = require('../helpers/hash');

module.exports = {
  async up(queryInterface, Sequelize) {
    const timeNow = new Date();
    await queryInterface.bulkInsert('Users', [
      {
        username: 'junarisalf',
        email: 'junarisalf@mail.com',
        password: hash('1234'),
        createdAt: timeNow,
        updatedAt: timeNow
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
