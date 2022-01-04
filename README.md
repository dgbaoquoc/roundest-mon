# Roundest - Which Pokémon is most round?

Answering all of life's toughest questions

## Getting Started

Prerequisite:

- MySQL local database (or Planetscale connection using PScale CLI)
- npm

Setup

1. Clone repo
1. `npm install`
1. Create `.env` file if one does not already exist
1. Add connection URLs for both database and shadow db to .env ([example .env file here](https://gist.github.com/TheoBr/e450c52a52a9f9c9b49ef07212689685))
1. Initialize database - `npx prisma migrate dev`
1. Initialize base data set - `npm run ts-node ./scripts/fill-db.ts`
1. Run dev server `npm run dev`
