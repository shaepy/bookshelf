# Bookshelf
A web app to collect and manage your books with Model-View-Controller (MVC) architecture.

## Tech Stack
- JavaScript
- Node.js
- Express.js
- EJS (Embedded JavaScript)
- MongoDB + Mongoose

## Requirements
- Create a full-stack application using Node.js, Express, EJS, and MongoDB.
- The application will center around a resource or schema of your choosing with full Create, Read, Update, and Delete (CRUD) functionalities.
- Define how this data will be structured in a Mongoose Schema. You need to consider what properties your resource will have and what data types these properties will be.

Your completed application should have the following RESTful routes:

| HTTP Method |      Route       |  Action |             Description                |
| ----------- | ---------------- | ------- | -------------------------------------- |
| GET         | /plants          | Index   | Displays a list of all plants          |
| GET         | /plants/new      | New     | Shows a form to create a new plant     |
| POST        | /plants          | Create  | Creates a new plant                    |
| GET         | /plants/:id      | Show    | Displays a specific plant by its ID    |
| GET         | /plants/:id/edit | Edit    | Shows a form to edit an existing plant |
| PUT         | /plants/:id      | Update  | Updates a specific plant by its ID     |
| DELETE      | /plants/:id      | Destroy | Deletes a specific plant by its ID     |

## Resources
- [Open Library API](https://openlibrary.org/dev/docs/api)
    - Book Search API
    - Authors API
    - Covers API for images