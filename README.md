# Static Redirect Service

This is a simple static redirect service implemented in client-side JavaScript.

## How it works

- **index.html / 404.html**: Entry points.
- **js/config.js**: Contains the fallback configuration.
- **js/rules_direct.js**: Contains rules for **direct** redirects (no intermediate page).
- **js/rules_intermediate.js**: Contains rules for **intermediate** redirects (shows a card, user must click to proceed).
- **js/redirect.js**: Handles the redirect logic.

## Configuration

### Rules Data Structure

The rules support an object structure with `expired_at`.

1.  **Direct Redirects** (`js/rules_direct.js`):
    ```javascript
    window.RULES_DIRECT = {
        "/path": {
            "url": "https://target.url",
            "expired_at": "2024-10-27T10:00:00Z"
        }
    };
    ```

2.  **Intermediate Redirects** (`js/rules_intermediate.js`):
    ```javascript
    window.RULES_INTERMEDIATE = {
        "/path": {
            "url": "https://target.url",
            "expired_at": ""
        }
    };
    ```

### Fallback

Edit `js/config.js`:

```javascript
window.REDIRECT_CONFIG = {
    fallback: "https://blog.acofork.com"
};
```

## Features

- **Split Rules**: Support for both direct and intermediate page redirects.
- **Metadata Support**: 
    - `expired_at`: Expiration timestamp (ISO 8601). **Note**: The frontend client simply redirects if the rule exists. Expiration management is handled by the backend service, which will remove expired rules from the file.
- **Intermediate Page**: Users are shown a card with the target URL and must click to proceed (for sensitive or external links).
- **CSP**: Content Security Policy configured.
- **Query Parameter Preservation**: Query parameters (e.g., `?callback=...`) are preserved and passed to the target URL.
- **Hash Preservation**: URL fragments (e.g., `#section`) are preserved.
- **Client-Side Only**: No server-side code (Node.js, PHP, etc.) required.

## Deployment

Deploy the entire repository to any static hosting provider (GitHub Pages, Cloudflare Pages, Netlify, Vercel, etc.).
