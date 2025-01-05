# Document Viewer API

Backend server for the Document Viewer application that handles Google Drive integration and file serving.

## Environment Variables

Required environment variables:
- `PORT` - Server port (default: 3000)
- `GOOGLE_CLIENT_EMAIL` - Google Service Account client email
- `GOOGLE_PRIVATE_KEY` - Google Service Account private key
- `GOOGLE_FOLDER_ID` - Google Drive folder ID to serve files from
- `CORS_ORIGIN` - Allowed CORS origins (comma-separated)

## Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required environment variables

3. Start the server:
```bash
npm run dev
```

## Deployment

The API is deployed on Render.com. See `render.yaml` for deployment configuration.