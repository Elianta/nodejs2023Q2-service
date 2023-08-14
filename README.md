# Home Library Service

## :seedling: Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/products/docker-desktop/).

## :hammer: Installation:

    git clone git@github.com:Elianta/nodejs2023Q2-service.git
    git checkout develop-part-2
    npm install

## :globe_with_meridians: Enviroment variables (.env):

    PORT=4000 // setup port on which application is running
    CRYPT_SALT=10 // setup saltRounds for bcrypt hash generation*
    <!-- postgress setup -->
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=db
    POSTGRES_PORT=5432
    DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public" // db connection url for prisma

\*[bcrypt hash generation](https://github.com/kelektiv/node.bcrypt.js#usage)

## :runner: Run in development mode:

    <!-- runs db container and app container (dev mode) -->
    docker-compose up

## :running: Run in production mode:

    docker-compose up db
    npm run start

## :cd: Build Docker image

    npm run docker:build -- -t rest-service:1.0.0

## :telescope: Scan created Docker image for vulnerabilities:

    npm run docker:scout

## :open_hands: Usage:

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

#### To explore and manipulate your db data:

    npx prisma studio

## :coffee: Testing:

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### :nail_care: Auto-fix and format

```
npm run lint
```

```
npm run format
```

## :ledger: API

| Method                              | Description                    |
| ----------------------------------- | ------------------------------ |
| :arrow_forward: Endpoint **user**   |                                |
| `GET user/`                         | Get all users                  |
| `GET user/${id}`                    | Get user by id (uuid)          |
| `POST user`                         | Create new user                |
| `PUT user/${id}`                    | Update user's password         |
| `DELETE user/${id}`                 | Delete user                    |
| :arrow_forward: Endpoint **track**  |                                |
| `GET track/`                        | Get all tracks                 |
| `GET track/${id}`                   | Get single track by id (uuid)  |
| `POST track`                        | Create new track               |
| `PUT track/${id}`                   | Update track info              |
| `DELETE track/${id}`                | Delete track                   |
| :arrow_forward: Endpoint **artist** |                                |
| `GET artist/`                       | Get all artists                |
| `GET artist/${id}`                  | Get single artist by id (uuid) |
| `POST artist`                       | Create new artist              |
| `PUT artist/${id}`                  | Update artist info             |
| `DELETE artist/${id}`               | Delete artist                  |
| :arrow_forward: Endpoint **album**  |                                |
| `GET album/`                        | Get all albums                 |
| `GET album/${id}`                   | Get single album by id (uuid)  |
| `POST album`                        | Create new album               |
| `PUT album/${id}`                   | Update album info              |
| `DELETE album/${id}`                | Delete album                   |
| :arrow_forward: Endpoint **favs**   |                                |
| `GET favs/`                         | Get all favorites              |
| `POST favs/track/${id}`             | Add track to the favorites     |
| `DELETE favs/track/${id}`           | Delete track from favorites    |
| `POST favs/album/${id}`             | Add album to the favorites     |
| `DELETE favs/album/${id}`           | Delete album from favorites    |
| `POST favs/artist/${id}`            | Add artist to the favorites    |
| `DELETE favs/artist/${id}`          | Delete artist from favorites   |
