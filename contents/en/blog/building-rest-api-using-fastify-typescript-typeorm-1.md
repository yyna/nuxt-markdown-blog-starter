---
name: 'building-rest-api-using-fastify-typescript-typeorm-1'
trans: 'building-rest-api-using-fastify-typescript-typeorm-1'
id: 'building-rest-api-using-fastify-typescript-typeorm-1'
title: Building RESTful API using fastify.js, typeORM, typescript - (1) Project settings, Identify Object Model
year: 17 May 2020
isTextColorDark: true
category: 'fastify'
description: |
  Let's set up the project and identify the object model.
---

## What to make

I want to create a simple project to study fastify.js and PostgreSQL. 🤓

Let's write a RESTful API that allows only authenticated users to create, read, update, and delete notes, and only those who have created notes can read, update, and delete them.

There is a User Model and the Memo model has a relationship belonging to the user.

The code used in the project can be found on [github](https://github.com/yyna/fastify-typescript-typeorm).

## Let's make it

### Project settings

1. initialize npm project
   ```
   npm init -y
   ```
2. install npm packages
   ```
   npm install --save fastify fastify-jwt fastify-plugin pg typeorm bcrypt
   ```
   - fastify
   - fastify-plugin
   - fastify-jwt: Used to implement authentication using JWT tokens.
   - pg: PostgreSQL Client
   - typeorm
   - bcrypt: Used for password encryption when implementing the user registration / login function.
   ```
   npm install --save-dev @types/bcrypt @types/node typescript ts-node
   ```
   - Install package to use typescript
3. Creating a typescript configuration file

   ```
   npx tsc --init
   ```

   If you enter the above command, you will get a file called tsconfig.json. For model creation, change only the two options shown below.

   ```javascript
   {
       "strictPropertyInitialization": false,
       "experimentalDecorators": true
   }
   ```

   - experimentalDecorators: Change to true to use the decorator added in ES7.
     [Blogs to reference about the ES7 decorator](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)
   - strictPropertyInitialization: In the model class, we don't initialize the value of the property, so change it to false.

4. Add start script to package.json

   ```javascript
   {
       "scripts": {
            "start": "ts-node --files ./src/index.ts"
        }
   }
   ```

### Run fastify instance (server)

```javascript
// src/index.ts
import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

const PORT = process.env.PORT || '3000';
const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({ logger: true });

// test code
server.get('/', async (request, reply) => {
  return { hello: 'world' };
});

server.listen(+PORT, '0.0.0.0', (err) => {
  if (err) throw err;
});
```

After running src/index.ts through `npm start` and entering localhost:3000 with a browser, it works fine as shown below.
<image-responsive imageURL="blog/building-rest-api-using-fastify-typescript-typeorm-1/1.png" width="100%" alt="src/index.ts"/>

### Identify Object Model

1. Memo model

   ```javascript
   // src/modules/memo/entity.ts
   import {
     CreateDateColumn,
     Column,
     Entity,
     PrimaryGeneratedColumn,
     UpdateDateColumn,
   } from 'typeorm';

   @Entity()
   export class Memo {
     @PrimaryGeneratedColumn()
     id: number;

     @Column({ type: 'varchar', length: 20, nullable: false })
     title: string;

     @Column({ type: 'varchar', length: 1000, nullable: false })
     content: string;

     @CreateDateColumn()
     created_at: Date;

     @UpdateDateColumn()
     updated_at: Date;
   }
   ```

2. Create database connection decorator
   There is an API called decorate that adds new properties to the fastify instance. Please refer to the [link](https://www.fastify.io/docs/v1.14.x/Decorators/) for details.

   ```javascript
   // src/decorators/db.ts
   import fp from 'fastify-plugin';
   import { createConnection, getConnectionOptions } from 'typeorm';
   import { Memo } from '../modules/memo/entity';

   export default fp(async (fastify) => {
     try {
       const connectionOptions = await getConnectionOptions();
       const connection = await createConnection(connectionOptions);

       fastify.decorate('db', {
         memo: connection.getRepository(Memo),
       });
     } catch (error) {
       console.log(error);
     }
   });
   ```

   Create 'db' decorator including memo repository.

3. Add 'db' decorator to fastify instance

```javascript
import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

import db from './decorators/db'; // Added part ✨

const PORT = process.env.PORT || '3000';
const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({ logger: true });

// test code
server.get('/', async (request, reply) => {
  return { hello: 'world' };
});

server.register(db); // Added part ✨

server.listen(+PORT, '0.0.0.0', (err) => {
  if (err) throw err;
});
```

4. Connecting to the database
   Let's set up to connect PostgreSQL to TypeORM. It can be set in several ways. I'm trying to use a method set via .env. See the [link](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) for more ways.

   ```
   // .env
   TYPEORM_CONNECTION=postgres
   TYPEORM_PORT=5432
   TYPEORM_HOST=localhost
   TYPEORM_USERNAME=admin
   TYPEORM_PASSWORD=password123!
   TYPEORM_DATABASE=test
   TYPEORM_SYNCHRONIZE=true
   TYPEORM_ENTITIES=src/modules/*/entity.ts
   ```

   As you can see from the configuration, postgres must be running on localhost.

   ```yaml
   # docker-compose.yml
   services:
     postgres:
       image: postgres
       environment:
         POSTGRES_USER: admin
         POSTGRES_PASSWORD: password123!
         POSTGRES_DB: test
       ports:
         - '5432:5432'
       volumes:
         - my_dbdata:/var/lib/postgres
   volumes:
     my_dbdata:
   ```

   ```
   docker-compose up
   ```

   I ran the database using docker-compose. You can run it directly locally.

   Run the server again via `npm start`. I have a table called memo in PostgreSQL running on localhost. It works successfully. 👏👏👏
   <image-responsive imageURL="blog/building-rest-api-using-fastify-typescript-typeorm-1/2.png" width="100%" alt="memo table"/>

5) User model
   The Memo model above does not have any user information that owns Memo. Let's add a user model.

   ```javascript
   // modules/user/entity.ts
   import {
     CreateDateColumn,
     Column,
     Entity,
     PrimaryGeneratedColumn,
     UpdateDateColumn,
   } from 'typeorm';

   @Entity()
   export class User {
     @PrimaryGeneratedColumn()
     id: number;

     @Column({ type: 'varchar', nullable: false })
     email: string;

     @Column({ type: 'varchar', nullable: false })
     password: string;

     @CreateDateColumn()
     created_at: string;

     @UpdateDateColumn()
     updated_at: string;
   }
   ```

   Add the user repository in the same way you added the memo repository to the db decorator.

   ```javascript
   import fp from 'fastify-plugin';
   import { createConnection, getConnectionOptions } from 'typeorm';
   import { Memo } from '../modules/memo/entity';
   import { User } from '../modules/user/entity'; // Added part ✨

   export default fp(async (fastify) => {
     try {
       const connectionOptions = await getConnectionOptions();
       const connection = await createConnection(connectionOptions);

       fastify.decorate('db', {
         memo: connection.getRepository(Memo),
         user: connection.getRepository(User), // Added part ✨
       });
     } catch (error) {
       console.log(error);
     }
   });
   ```

   Then add user information (which owns the memo) to the Memo model.

   ```javascript
   // src/modules/memo/entity.ts
   import {
     CreateDateColumn,
     Column,
     Entity,
     PrimaryGeneratedColumn,
     UpdateDateColumn,
     ManyToOne, // Added part ✨
     JoinColumn, // Added part ✨
   } from 'typeorm';

   @Entity()
   export class Memo {
     @PrimaryGeneratedColumn()
     id: number;

     @Column({ type: 'varchar', length: 20, nullable: false })
     title: string;

     @Column({ type: 'varchar', length: 1000, nullable: false })
     content: string;

     @ManyToOne((type) => User) // Added part ✨
     @JoinColumn({ name: 'user_id' }) // Added part ✨
     user: User; // Added part ✨

     @CreateDateColumn()
     created_at: Date;

     @UpdateDateColumn()
     updated_at: Date;
   }
   ```

   If you try `npm start` again, the user table has been created successfully and user_id has been added to the memo table !!!!
   <image-responsive imageURL="blog/building-rest-api-using-fastify-typescript-typeorm-1/3.png" width="100%" alt="memo table 2"/>
   <image-responsive imageURL="blog/building-rest-api-using-fastify-typescript-typeorm-1/4.png" width="100%" alt="user table"/>
