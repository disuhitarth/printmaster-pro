# Contributing to PrintMaster Pro

We love your input! We want to make contributing to PrintMaster Pro as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/disuhitarth/printmaster-pro.git
   cd printmaster-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Code Style

We use ESLint and Prettier for code formatting and linting. Please ensure your code follows these standards:

- Run `npm run lint` to check for linting errors
- Run `npm run typecheck` to check TypeScript types
- Use meaningful commit messages

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Run `npm test` for unit tests
- Run `npm run test:e2e` for end-to-end tests

## Commit Messages

We follow the conventional commits specification:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` code style changes
- `refactor:` code refactoring
- `test:` test-related changes
- `chore:` maintenance tasks

Example: `feat: add inventory export functionality`

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/disuhitarth/printmaster-pro/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Provide a clear description of the feature
3. Explain why this feature would be useful
4. Provide examples if possible

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to contact the maintainers if you have any questions.