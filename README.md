# STANCE

STANCE is a student-focused platform for discovering competitions, collaborating on projects, finding teammates, showcasing skills, and exploring student services.

## Project structure

- `public/` — frontend HTML, CSS, and JavaScript
- `api/` — authenticated backend endpoints
- `migrations/` — database schema migrations
- `hatchable.toml` — Hatchable project configuration

## Development

This project currently runs on Hatchable. The backend imports the `hatchable` runtime and is not a standalone Node.js server without adapting those platform APIs.

## Important notes

- Competition cards and example metrics in the UI are demonstration content; verify event details and organiser rules independently.
- Team matching only includes students who opt in to teammate discovery.
- AI-powered endpoints require the configured AI provider. The competition eligibility assessment also includes a local rule-based path.
- Never commit API keys, secrets, private user data, or production database exports.
