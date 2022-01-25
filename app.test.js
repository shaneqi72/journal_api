const request = require('supertest');

const app = require('./app');

describe('App Tests', () => {
  test('GET / ', async () => {
    //set which application to be request, AND tell request method and route
    const res = await request(app).get('/'); //supertest method

    //jest method
    expect(res.status).toBe(200);
    expect(res.body.info).toEqual('Journal Api app');
    expect(res.body.info).toMatch(/journal/i);
  });

  test('Get /categories', async () => {
    const res = await request(app).get('/categories');
    const expected = [/food/i, /coding/i, /other/i];

    expect(res.status).toBe(200);
    //supertest convert headers to lower case when do testing header eg: 'Content-Type' will not work, but 'content-type'
    expect(res.headers['content-type']).toMatch(/json/i);
    expect(res.body.length).toBe(3);
    expect(res.body[0].name).toMatch(/food/i);

    res.body.forEach((cat, index) => {
      expect(cat.name).toMatch(expected[index]);
    });
  });

  test('POST /entries', async () => {
    const res = await request(app).post('/entries').send({
      cat_id: 1,
      content: 'Test entry',
    });
    expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/i);
      expect(res.body.id).toBeTruthy()
      expect(res.body.content).toBe('Test entry')
      expect(parseInt(res.body.category_id)).toBe(1)
  });
});
