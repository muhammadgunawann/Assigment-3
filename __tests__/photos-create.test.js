const request = require('supertest');
const app = require('./../app');
const {sequelize} = require('./../models/index');
const {queryInterface} = sequelize;
const {hash} = require('./../helpers/hash');
const {sign} = require('../helpers/jwt');

const user = {
    username: 'junarisalf',
    email: 'junarisalf@mail.com',
    password: '1234',
    createdAt: new Date(),
    updatedAt: new Date(),
};
const userToken = sign({id: 1, email: user.email});
const userNotExistsToken = sign({id: 99, email: 'notexists@mail.com'});

const defaultPhoto = {
    title: 'Test Photo',
    caption: 'Test Photo caption',
    image_url: 'http://image.com/testphoto.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    UserId: 1,
};

beforeAll(async () => {
    await queryInterface.bulkDelete('Photos', null, {
        truncate: true,
        restartIdentity: true,
        cascade: true,
    });
    await queryInterface.bulkDelete('Users', null, {
        truncate: true,
        restartIdentity: true,
        cascade: true,
    });
    const hashedUser = {...user};
    hashedUser.password = hash(hashedUser.password);
    await queryInterface.bulkInsert('Users', [hashedUser]);
    await queryInterface.bulkInsert('Photos', [defaultPhoto]);
});

afterAll(async () => {
    sequelize.close();
});


const addPhoto = {
    title: 'Test Photo 2',
    caption: 'Test Photo caption 2',
    image_url: 'http://image.com/testphoto.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    UserId: 1,
};

const wrongAddPhoto = {
    caption: 'Test Photo caption 2',
    image_url: 'http://image.com/testphoto.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    UserId: 1,
};
describe('POST photo/', () => {
    test('should return HTTP status code 201', async () => {
        const {body} = await request(app)
            .post('/photos/')
            .set('Authorization', `Bearer ${userToken}`)
            .send(addPhoto)
            .expect(201);
        expect(body).toEqual({
            id: 2,
            title: addPhoto.title,
            caption: `${addPhoto.title.toUpperCase() + ' ' + addPhoto.image_url }`,
            image_url: addPhoto.image_url,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            UserId: addPhoto.UserId
        })
    });

    test('should return 400 if Title/Other Field Empty', async () => {
        const {body} = await request(app)
            .post('/photos/')
            .set('Authorization', `Bearer ${userToken}`)
            .send(wrongAddPhoto)
            .expect(400);
        expect(body.message[0]).toMatch(/Title cannot be omitted/i);
    });

    test('should return HTTP status code 401 when no authorization', async () => {
        const {body} = await request(app)
            .post('/photos/')
            .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });
   
    test('should return HTTP status code 401 when no token provided', async () => {
        const {body} = await request(app)
            .post('/photos/')
            .set('Authorization', 'Bearer ')
            .expect(401);
        expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when user does not exist', async () => {
        const {body} = await request(app)
            .post('/photos/')
            .set('Authorization', `Bearer ${userNotExistsToken}`)
            .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });
});
