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

App needs Postgres DB on localhost. To run it, the following comman may executed:

    docker run --rm --name pg -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres

Migration script can be found in `db` folder.

## Available Scripts

In the project directory, you can run:

### `npm serve`

Runs the app in the development mode.\

### `npm run lint`

Launches the ESLint to find code's problems.\

### `npm run format`

Launches the Prettier to format the code.\

### `npm run migration:up`

Init the database tables with predefined collection.\

### `npm run migration:down`

Drop the database tables.\
