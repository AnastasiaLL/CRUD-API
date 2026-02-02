import { handleRequest } from '../src/server';
import request from 'supertest';
import { createServer } from 'http';

const app = createServer((req, res) => {
  handleRequest(req, res);
});

const agent = request.agent(app);


describe('Scenario 1: CRUD operations', () => {
    let createdUserId: string;

    test('1. GET /api/users should return empty array initially', async () => {
    const response = await agent
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toEqual([]);
    })

     test('2. POST /api/users should create new user', async () => {
        const userData = {
        username: 'Test User',
        age: 25,
        hobbies: ['reading', 'swimming']
        };
        const response = await agent
            .post('/api/users')
            .send(userData)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201);
            
        expect(response.body).toMatchObject(userData);
        expect(response.body.id).toBeDefined();
        expect(typeof response.body.id).toBe('string');

        createdUserId = response.body.id;
    })

     test('3. GET /api/users/{id} should return created user', async () => {
    const response = await agent
      .get(`/api/users/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.username).toBe('Test User');
  });

  test('4. PUT /api/users/{id} should update user', async () => {
    const updatedData = {
      username: 'Updated User',
      age: 30,
      hobbies: ['coding']
    };
      const response = await agent
      .put(`/api/users/${createdUserId}`)
      .send(updatedData)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.username).toBe('Updated User');
    expect(response.body.age).toBe(30);
  });

   test('5. DELETE /api/users/{id} should delete user', async () => {
    const response = await agent
      .delete(`/api/users/${createdUserId}`)
      .expect(204);
    
    expect(response.body).toEqual({});
  });
  
  test('6. GET /api/users/{id} should return 404 after deletion', async () => {
    const response = await agent
      .get(`/api/users/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(404);
    
    expect(response.body.error).toBeDefined();
  });
})