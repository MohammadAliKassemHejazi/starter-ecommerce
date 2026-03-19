# Real-Time E-Commerce System

## What I Did
* Added the basic backend routes for Categories, Orders, Cart, Favorites, Authentication, Products, and other related entities.
* Integrated Swagger documentation setup in `server/src/routes/index.ts`.
* Configured Sequelize to use an in-memory SQLite database for test purposes (which is set in the test environment).
* Fixed the `User` model association problem that was causing errors.

## What is Missing / Known Issues
* The `Promotion` table and related API might not be fully functional. Tests are failing for promotion-related operations.
* Product Image uploading and removal functionalities seem to lack proper setup or validation. Tests fail when handling images.
* There seem to be multiple issues with tests not being properly mocked, especially around `mockUser` usage. The test suite fails when attempting to test authentication, categories, and other entities because certain mocks are expected but not correctly supplied.
* The tests need to be carefully verified and potentially rewritten or updated to match the existing API routes and data structures.

## Instructions
1. Navigate to the `server/` directory.
2. Run `npm install` to install dependencies.
3. Set the environment variables appropriately (e.g., `DB_DIALECT=sqlite`, `DB_STORAGE=:memory:` for a fresh local database).
4. Start the server using `npm run start` or a similar startup script.
