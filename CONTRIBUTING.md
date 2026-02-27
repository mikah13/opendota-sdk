# Contributing to opendota-sdk

Thanks for your interest in contributing!

## Development Setup

```bash
git clone https://github.com/your-username/opendota-sdk.git
cd opendota-sdk
npm install
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build for distribution |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:live` | Run live API tests |
| `npm run typecheck` | Type check |
| `npm run lint` | Lint source |
| `npm run generate` | Generate types from OpenAPI schema |
| `npm run fetch-schema` | Fetch latest OpenAPI schema |

## Adding a New Endpoint

1. **Generate types**: Run `npm run generate` to update types from the schema
2. **Add resource**: Create or update a resource class in `src/resources/`
3. **Export**: Add export to `src/resources/all.ts` and `src/index.ts`
4. **Add tests**: Add unit tests in `tests/unit/`
5. **Verify**: Run `npm run typecheck && npm test`

## Running Tests

```bash
# Unit tests (mocked)
npm test

# Live tests (requires API key)
OPENDOTA_LIVE_TEST=1 OPENDOTA_KEY=your-key npm run test:live
```

## Code Style

- TypeScript strict mode
- Use ESM imports (`.js` extension)
- No comments unless explaining non-obvious logic

## Submitting Changes

1. Fork the repo
2. Create a feature branch
3. Make changes
4. Run `npm run typecheck && npm test`
5. Open a PR

## License

By contributing, you agree your code will be licensed under MIT.
