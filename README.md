# Cloud Media

A React and Vite front end paired with an Azure Functions upload service. The project is a portfolio prototype for a media-upload workflow that separates browser UI concerns from server-side upload handling.

## Stack

- React + Vite
- JavaScript and ESLint
- Azure Functions (Node.js)
- Azure-hosted media/storage integration (configured through environment variables)

## Architecture

```text
Browser (React/Vite) → Azure Function upload endpoint → configured media/storage provider
```

The UI lives in `src/`; the serverless upload endpoint is under `azure-functions-backend/uploadMedia/`.

## Local setup

1. Copy `.env.example` to `.env` and provide local development values.
2. Install the root dependencies with `npm ci`.
3. Run the front end with `npm run dev`.
4. Install and run the Azure Functions project separately from `azure-functions-backend/` using the Azure Functions Core Tools.

Never commit `.env`. Use your host's secret store for deployed values.

## Features

- Media-focused React UI
- Loading-state component
- Serverless upload endpoint boundary
- Separate client and function dependency manifests

## Testing and limitations

This repository does not yet provide automated tests or CI. Before production use, add component tests, API contract tests for the function, file-size/type validation, rate limiting, upload authorization, and observability. Confirm CORS and storage-provider settings in each environment.

## Security

See [SECURITY.md](SECURITY.md). Any credential previously committed in the removed `.env` must be rotated.

## License

No license has been selected yet.