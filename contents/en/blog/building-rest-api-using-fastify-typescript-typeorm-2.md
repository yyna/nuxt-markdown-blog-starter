---
name: 'building-rest-api-using-fastify-typescript-typeorm-2'
trans: 'building-rest-api-using-fastify-typescript-typeorm-2'
title: Building RESTful API using fastify.js, typeORM, typescript - (2) Route, Middleware, Handler
year: 17 May 2020
color: '#edece7'
isTextColorDark: true
extraComponent: 'Datatable'
id: 'building-rest-api-using-fastify-typescript-typeorm-2'
category: 'fastify'
description: |
  Let's create Route, Middleware and Handler.
---

### Create Route

1.  Add /memo route

    ```javascript
    // src/modules/router.ts
    import fp from 'fastify-plugin';

    export default fp((server, opts, next) => {
      server.get('/memo', (request, reply) => {
        reply.code(200).send('get memo list');
      });

      server.get('/memo/:id', (request, reply) => {
        reply.code(200).send('get memo');
      });

      server.post('/memo', (request, reply) => {
        reply.code(200).send('create new memo');
      });

      server.patch('/memo/:id', (request, reply) => {
        reply.code(200).send('update memo');
      });

      server.delete('/memo/:id', (request, reply) => {
        reply.code(200).send('delete memo');
      });

      next();
    });
    ```

    You can add Routes directly to your fastify instance. See [https://www.fastify.io/docs/latest/Routes/](https://www.fastify.io/docs/latest/Routes/) for more information.

    Now let's delete the test code that responses { hello: 'world' } and add a route. This is the same as registering decorator.

    ```javascript
    // src/index.ts
    import fastify from 'fastify';
    import { Server, IncomingMessage, ServerResponse } from 'http';

    import db from './decorators/db';
    import memo from './modules/memo/router'; // Added part ✨

    const PORT = process.env.PORT || '3000';
    const server: fastify.FastifyInstance<
      Server,
      IncomingMessage,
      ServerResponse
    > = fastify({ logger: true });

    server.register(db);
    server.register(memo); // Added part ✨

    server.listen(+PORT, '0.0.0.0', (err) => {
      if (err) throw err;
    });
    ```

2.  Create http request  
    For testing, let's test the http request using the VSCode extension. After seeing me suffering from Postman, the developer next door recommended it and it was very convenient.
    [https://marketplace.visualstudio.com/items?itemName=humao.rest-client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

    Create memo.http file

    ```
     # src/tests/requests/memo.http
     @host = http://localhost:3000

     ################################################ create new memo
     POST {{host}}/memo HTTP/1.1

     ################################################ get memo list
     GET {{host}}/memo HTTP/1.1

     ################################################ get memo
     GET {{host}}/memo/123 HTTP/1.1

     ################################################ update memo title
     PATCH {{host}}/memo/123 HTTP/1.1

     ################################################ delete memo
     DELETE {{host}}/memo/123 HTTP/1.1
    ```

    <image-responsive imageURL="blog/building-rest-api-using-fastify-typescript-typeorm-2/1.png" width="100%" alt="memo http"/>
    You can create http request by clicking `Send Request`. Of course, the server must be running. All five requests have successfully responded. 💃🏻🕺🏻💃🏻🕺🏻

3.  Add /user route  
    Add user routes in the same way you add memo routes.

    ```javascript
    // src/index.ts
    import fastify from 'fastify';
    import { Server, IncomingMessage, ServerResponse } from 'http';

    import db from './decorators/db';
    import memo from './modules/memo/router';
    import user from './modules/user/router'; // Added part ✨

    const PORT = process.env.PORT || '3000';
    const server: fastify.FastifyInstance<
      Server,
      IncomingMessage,
      ServerResponse
    > = fastify({ logger: true });

    server.register(db);
    server.register(memo);
    server.register(user); // Added part ✨

    server.listen(+PORT, '0.0.0.0', (err) => {
      if (err) throw err;
    });
    ```

    Let's make http request too. 💃🏻🕺🏻💃🏻🕺🏻

    ```
     # src/tests/requests/user.http
     @host = http://localhost:3000

     ################################################ sign up
     POST {{host}}/sign-up HTTP/1.1

     ################################################ sign in
     POST {{host}}/sign-in HTTP/1.1
    ```

### Create Middleware

1.  Add auth middleware  
    Add middleware so that only authorized users can access the memo route. I use JWT.

    ```javascript
    // src/middlewares/auth.ts
    import fp from 'fastify-plugin';
    import jwt from 'fastify-jwt';

    export default fp((server, opts, next) => {
      server.register(jwt, {
        secret: 'secret',
      });
      server.decorate('auth', async (req: any, res: any) => {
        try {
          await req.jwtVerify();
        } catch (err) {
          res.send(err);
        }
      });

      next();
    });
    ```

    Add it to your fastify instance.

    ```javascript
    // src/index.ts
    import fastify from 'fastify';
    import { Server, IncomingMessage, ServerResponse } from 'http';

    import db from './decorators/db';
    import auth from './middlewares/auth'; // Added part ✨

    import memo from './modules/memo/router';
    import user from './modules/user/router';

    const PORT = process.env.PORT || '3000';
    const server: fastify.FastifyInstance<
      Server,
      IncomingMessage,
      ServerResponse
    > = fastify({ logger: true });

    server.register(db);
    server.register(auth); // Added part ✨

    server.register(memo);
    server.register(user);

    server.listen(+PORT, '0.0.0.0', (err) => {
      if (err) throw err;
    });
    ```

2.  Adding properties to the FastifyInstance interface  
    db, auth, and jwt decorator are added to the fastify instance, but the interface is required for use because the FastifyInstance interface does not have the corresponding property.

    ```javascript
    // src/@types/fastify/index.d.ts
    import { Server, IncomingMessage, ServerResponse } from 'http';
    import { Repository } from 'typeorm';

    import { Memo } from '../../modules/memo/entity';
    import { User } from '../../modules/user/entity';

    interface Repositories {
      memo: Repository<Memo>;
      user: Repository<User>;
    }

    declare module 'fastify' {
      export interface FastifyInstance<
        HttpServer = Server,
        HttpRequest = IncomingMessage,
        HttpResponse = ServerResponse
      > {
        db: Repositories;
        auth: any;
        jwt: any;
      }
    }
    ```

### Create Handler

1. Create sign-up/sign-in handler

   ```javascript
   // src/modules/user/router.ts
   import fp from 'fastify-plugin';
   import bcrypt from 'bcrypt';

   export default fp((server, opts, next) => {
     server.post('/sign-up', async (request, reply) => {
       const { email, password } = request.body;
       const user = await server.db.user.findOne({ email });

       if (user) {
         reply.code(409).send('EMAIL_ALREADY_TAKEN');
       } else {
         await server.db.user.save({
           email,
           password: bcrypt.hashSync(password, 8),
         });
         reply.code(201).send();
       }
     });

     server.post('/sign-in', async (request, reply) => {
       const { email, password } = request.body;
       const user = await server.db.user.findOne({ email });

       if (user) {
         // check password
         if (bcrypt.compareSync(password, user.password)) {
           const token = server.jwt.sign(user.id + '');
           reply.code(200).send({ token });
         }
         // password mismatch
         else {
           reply.code(401).send('PASSWORD_MISMATCH');
         }
       } else {
         reply.code(404).send('USER_NOT_FOUND');
       }
     });

     next();
   });
   ```

   Test it after adding Content-Type and request.body to the user.http file.

   ```
   # src/tests/requests/user.http
   @host = http://localhost:3000

   ################################################ sign up
   POST {{host}}/sign-up HTTP/1.1
   Content-Type: application/json

   {
       "email": "test@email.com",
       "password": "testpassword"
   }

   ################################################ sign in
   POST {{host}}/sign-in HTTP/1.1
   Content-Type: application/json

   {
       "email": "test@email.com",
       "password": "testpassword"
   }
   ```

2. Creating memo CRUD handler  
   The memeo handler uses the `preValidation` option differently from the user handler. This is because only authenticated users can access it. After passing through auth middleware added as preValidation, it is passed to handler with user information in request.user.

   ```javascript
   // src/modules/memo/router.ts
   // ....

   server.get(
     '/memo',
     { preValidation: server.auth },
     async (request, reply) => {
       const memos = await server.db.memo.find({
         where: {
           user: +request.user,
         },
       });
       reply.code(200).send({ memos });
     }
   );

   // ...
   ```

   [See full code of router.ts on github](https://github.com/yyna/fastify-typescript-typeorm/blob/master/src/modules/memo/router.ts)

3. Add global error handler  
    In order to handle all errors in one place, the handler did not handle any errors.

   ```javascript
   // src/index.ts
   // ...
   server.setErrorHandler((error, request, reply) => {
     const statusCode = error.statusCode || 500;
     const message = error.message || 'INTERNAL_SERVER_ERROR';
     reply.code(statusCode).send({
       statusCode,
       message,
     });
   });
   // ...
   ```

   [See full code of index.ts on github](https://github.com/yyna/fastify-typescript-typeorm/blob/master/src/index.ts)

### Try it

Looking back at the API access rights that we wanted to create for the first time:

> Let's write a RESTful API that allows only authenticated users to create, read, update, and delete notes, and only those who have created notes can read, update, and delete them.

A JWT token is required to access the /memo route.  
When you log in after signing up, you can access the memo route by adding the token included in the response to the token at the top of memo.http.

<image-responsive imageURL="blog/building-rest-api-using-fastify-typescript-typeorm-2/2.png" width="100%" alt="Example login response"/>

In the example below, memo with id = 2 and id = 3 is accessible only to users with id = 1. You can see that registration, login and memo Create, Read, Update, Delete works well.

<image-responsive imageURL="blog/building-rest-api-using-fastify-typescript-typeorm-2/3.png" width="100%" alt="user table"/>
<image-responsive imageURL="blog/building-rest-api-using-fastify-typescript-typeorm-2/4.png" width="100%" alt="memo table"/>

RESTful API is complete! The full code can be found on github.  
[See full code on github](https://github.com/yyna/fastify-typescript-typeorm)
