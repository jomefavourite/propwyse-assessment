import { http, HttpResponse } from 'msw';

let users = [
  {
    // id: uuidv4(),
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  },
];

export const handlers = [
  http.get('https://api.example.com/user', () => {
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    });
  }),

  http.get('http://localhost:3001/users', () => {
    return HttpResponse.json(users);
  }),
];
