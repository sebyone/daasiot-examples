'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const t = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.bulkInsert('device_model_group', [
        {
          id: 1,
          title: 'Gruppo 1',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultricies iaculis scelerisque. Sed id arcu ac dui blandit pulvinar. Fusce leo libero, egestas at efficitur at, mattis quis diam. Aenean blandit, dolor eu feugiat mollis, quam erat tempus magna, vel pulvinar erat dui aliquam nunc. Ut tristique felis magna, nec tristique velit fringilla vitae. Nunc rutrum dignissim imperdiet. Phasellus quis est non mauris consequat lobortis. Aliquam velit lorem, bibendum in quam id, pharetra cursus ligula. Fusce varius purus nec cursus egestas. ',
          // link_image: 'https://placehold.co/200x200/eeaaee/000000/png',
        },
        {
          id: 2,
          title: 'Gruppo 2',
          description: 'Maecenas ut efficitur orci. Donec mattis velit nisi, quis sodales nisl posuere at. Pellentesque rhoncus, dolor ac ornare auctor, purus tortor semper felis, a posuere sapien risus sed augue. Ut et faucibus sapien. Phasellus ultricies maximus felis a venenatis. Ut id nibh nulla. Suspendisse fringilla pretium felis, quis tristique lorem tincidunt sit amet. Ut sit amet libero ac massa volutpat posuere sit amet et lorem. Phasellus ut odio metus. Suspendisse cursus in massa at dignissim. Maecenas sed feugiat ligula. In facilisis arcu sed purus pretium, vitae laoreet lorem suscipit.',
          // link_image: 'https://placehold.co/200x200/eeaaaa/000000/png',
        }
      ], { transaction: t });

      await queryInterface.bulkInsert('device_model', [
        {
          id: 1,
          device_group_id: 1,
          description: 'Modello 1',
          serial: '007114173493',
          // link_image: 'https://placehold.co/600x400/ffffbb/000000/png',
          // link_datasheet: 'https://www.example.com/datasheet1.pdf',
          // link_userguide: 'https://www.example.com/userguide1.pdf',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          device_group_id: 2,
          description: 'Modello 2',
          serial: '123997757716',
          // link_image: 'https://placehold.co/500x500/ffbbff/000000/png',
          // link_datasheet: 'https://www.example.com/datasheet2.pdf',
          // link_userguide: 'https://www.example.com/userguide2.pdf',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          device_group_id: 2,
          description: 'Modello 3',
          serial: '8810056391',
          // link_image: 'https://placehold.co/500x600/ffbbbb/000000/png',
          // link_datasheet: 'https://www.example.com/datasheet3.pdf',
          // link_userguide: 'https://www.example.com/userguide3.pdf',
          created_at: new Date(),
          updated_at: new Date(),
        }
      ], { transaction: t });


      await queryInterface.bulkInsert('device', [
        {
          id: 1,
          device_model_id: 1,
          din_id: 1,
          name: 'Dispositivo 1',
          latitude: 39.3017,
          longitude: 16.2537,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          device_model_id: 2,
          din_id: 2,
          name: 'Device 2',
          latitude: 39.2854,
          longitude: 16.2619,
          created_at: new Date(),
          updated_at: new Date(),
        }
      ], { transaction: t });
      await t.commit();
    }
    catch (err) {
      console.error(err);
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('device', null, { transaction: t });
      await queryInterface.bulkDelete('device_model', null, { transaction: t });
      await queryInterface.bulkDelete('device_model_group', null, { transaction: t });
      await t.commit();
    }
    catch (err) {
      await t.rollback();
      throw err;
    }
  }
};
