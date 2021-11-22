# node-js-mentoring
Simple app to learn Node.js
Before development can begin, dependencies must be installed:

    npm install

App needs Postgres DB on localhost. To run it, the following comman may executed:

    docker run --rm --name pg -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres

Migration script can be found in `db` folder.

App needs Postgres DB on localhost. To run it, the following comman may executed:

    docker run --rm --name pg -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres

Migration script can be found in `db` folder.
To add seeds in db:

    cd db
    npm install
    npm run migrate:up

To drop db:

    npm run migrate:down

To run app using `docker-compose`:

    docker-compose build
    docker-compose up

Request examples:

    curl --location --request GET 'localhost:5000/api/users'
    curl --location --request GET 'localhost:5000/api/groups'


## Available Scripts

In the project directory, you can run:

### `npm serve`

Runs the app in the development mode.\

### `npm run lint`

Launches the ESLint to find code's problems.\

### `npm run format`

Launches the Prettier to format the code.\

### `npm run migrate:up` in `db` folder

Init the database tables with predefined collection.\

### `npm run migrate:down` in `db` folder

Drop the database tables.\
