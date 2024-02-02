# E-Commerce API

> This repository contains the source code of an fake and minimalist E-Commerce API. Designed to manage and organize inventory, available products and orders.

The main technologies used are:

- [Hono](https://hono.dev/): Framework for building efficient, scalable and blazingly fast 😉 server-side applications in Node
- [Typescript](https://www.typescriptlang.org/): Strongly typed 💪 programming language that builds on JavaScript
- [Mongo](https://www.mongodb.com/): Non-relational database management system. 🤷‍♂️
- [Mongoose](https://mongoosejs.com/): Elegant 🎩 MongoDB object modeling for Node.js

## Endpoints

---

#### Users

| Description              | Method | URL              |
| ------------------------ | ------ | ---------------- |
| Register                 | POST   | api/users/       |
| Login                    | POST   | api/users/login  |
| Logout from all sessions | POST   | api/users/logout |
| User orders              | GET    | api/users/orders |

#### Products

| Description    | Method | URL              |
| -------------- | ------ | ---------------- |
| Get available  | GET    | api/products/    |
| Get one by Id  | GET    | api/products/:id |
| Create product | POST   | api/products/    |
| Update product | PUT    | api/products/:id |
| Delete product | DELETE | api/products/:id |

#### Orders

| Description                   | Method | URL                     |
| ----------------------------- | ------ | ----------------------- |
| Create order                  | POST   | api/orders/             |
| Get one by Id                 | GET    | api/orders/:id          |
| Update order product quantity | PUT    | api/orders/:id/quantity |
| Update order status           | PUT    | api/orders/:id/status   |
| Delete order                  | DELETE | api/orders/:id          |

## Getting started

---

### Clone the repo

```sh
git clone git@github.com:chrisdadev13/e-commerce.git && cd e-commerce
```

#### Setup Environment Variables

```sh
NODE_ENV=<'development' | 'production' | 'staging'>
DB_URI=<URI used to connect to a production MongoDB database>
PORT=<The port the server will run on, e.g. 3000>
SECRET_KEY=<Secret used to sign the session ID cookie>
```

#### Install dependencies

```sh
pnpm i
pnpm dev
```
