# Bookshelf
A web app to collect and manage your books with Model-View-Controller (MVC) architecture.

#### Bookshelf Features
- Add a book to your collection manually or through search
- Save to your Reading List, Books Read, Favorites or to My Library for books you own
- Edit book information
- Delete books from your shelf
- Session auth: create an account and sign in to manage your book collection

#### Home Page
<img width="500" alt="home page" src="https://github.com/user-attachments/assets/8263a9aa-acd4-4875-81d3-5bb57bbe3483" />

#### Bookshelf
<img height="350" alt="bookshelf page" src="https://github.com/user-attachments/assets/81ec94bc-2a6f-4f06-b1ce-6deff59bf8a7" />
<img height="350" alt="reading list" src="https://github.com/user-attachments/assets/882df54a-c570-4cd5-876e-bca4743e90d5" />

#### Search Page
<img width="450" alt="search page" src="https://github.com/user-attachments/assets/b619403a-eb09-4c48-a9e7-1267c15d2041" />

#### Search Results
<img height="275" alt="search results for girl with dragon tattoo" src="https://github.com/user-attachments/assets/f1a638c0-cd06-4b61-a85c-b25b02c5f1f7" />
<img height="275" alt="search results for stephen king" src="https://github.com/user-attachments/assets/874722df-a820-408e-8159-a0a531136880" />

#### Select Book Edition
<img height="275" alt="select book edition" src="https://github.com/user-attachments/assets/72531733-d4d9-4228-9d56-73157263440b" />
<img height="275" alt="book editions page with more options" src="https://github.com/user-attachments/assets/9e6eb005-83e0-4ca6-ac19-e7189b55963f" />

#### New Book Added / Book Page
<img width="450" alt="new book added to bookshelf" src="https://github.com/user-attachments/assets/6634ead0-80e5-4a10-80fa-c4018fc94530" />

#### Add Book by Form
<img height="400" alt="new book form" src="https://github.com/user-attachments/assets/13cb34bf-7cf9-4062-9ec5-176d0cbb1ebe" />

## Tech Stack
- JavaScript
- Node.js
- Express.js
- EJS (Embedded JavaScript)
- MongoDB + Mongoose

### Resources
- [Open Library API](https://openlibrary.org/dev/docs/api)
    - Book Search API
    - Authors API
    - Covers API for images

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
