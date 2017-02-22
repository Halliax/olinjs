var request = require('supertest');
var app = require('./../../app.js');
var testUser = request.agent(app);


describe("The app", function() {
  it('should return 200 OK on GET /login', function(done) {
    request(app)
      .get('/login')
      .expect(200, done);
  });

  it('should respond with the correct html on GET /login', function(done) {
    request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Content-Length', '985', done);
  });

  it('should redirect to /login on unauthenticated GET /', function(done) {
    request(app)
      .get('/')
      .expect(302)
      .expect('Location','/login', done);
  });

  it('should return 401 on unauthenticated GET /user', function(done) {
    request(app)
      .get('/user')
      .expect(401, done);
  });

  it('should create or login user session for valid user', function (done) {
    testUser
      .post('/login')
      .send({ username: 'test user', password: 'testtest' })
      .expect(302)
      .expect('Location','/')
      done();
  });

  it('should get user session for current user', function (done) {
    testUser
      .get('/user')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Content-Length', '985', done);
  });

  it('should return 200 OK on authenticated GET /', function(done) {
    testUser
      .get('/')
      .expect(200, done);
  });

  it('should post from authenticated user', function(done) {
    testUser
      .post('/post')
      .send({ bodyText: 'test text', user: 'test user', userId: "58ae13abb5bf1f333fb29443" })
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('Content-Length', '112', done);
  });

  it('should return 302 and redirect to /login on GET /logout', function(done) {
    request(app)
      .get('/logout')
      .expect(302)
      .expect('Location', '/login', done);
  });

  it('should return 404 on GET /notaroute', function(done) {
    request(app)
      .get('/notaroute')
      .expect(404, done);
  });
});
