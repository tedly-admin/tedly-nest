## Requirment

- Node 24
- Postgres 17
- docker (for integrations tests)

## How to run

- create db in postgres with name 'tedly_nest'
- npm i
- npm run start:dev
- in browser type http://localhost:5000/categories
- install Jest Runner plugin
- intall Prettier plugin
- create .env from env-example file

## Swagger documentation

- localhost:5000/api
- localhost:5000/api-json

## Jest settings

{
"jestrunner.codeLensSelector": "**/*.{test,spec,e2e-spec}.{js,jsx,ts,tsx}",
"jestrunner.configPath": "test/jest-e2e.json"
}