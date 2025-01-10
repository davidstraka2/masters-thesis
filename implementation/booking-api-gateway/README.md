# Booking API Gateway

## Dependencies

Node.js 22.11.0 or newer, along with npm 10.9.0 or newer must be installed.

## Installation

```bash
$ npm install
```

## Environment variables

```bash
$ cp .env.template .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode - make sure to change the NODE_ENV env variable to NODE_ENV=production
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
