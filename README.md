# opendota-sdk

> Type-safe TypeScript SDK for the [OpenDota API](https://docs.opendota.com).

[![npm version](https://img.shields.io/npm/v/opendota-sdk)](https://npmjs.com/package/opendota-sdk)
[![license](https://img.shields.io/npm/l/opendota-sdk)](LICENSE)

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Available Resources](#available-resources)
- [Configuration](#configuration)
- [Error Handling](#error-handling)
- [Request Cancellation](#request-cancellation)
- [Rate Limits](#rate-limits)
- [Contributing](#contributing)

---

## Installation
```bash
npm install opendota-sdk
# pnpm add opendota-sdk
# bun add opendota-sdk
```

## Quick Start
```typescript
import { OpenDota } from "opendota-sdk";

const client = new OpenDota();

// Get match data
const { data: match, rateLimit } = await client.matches.get(7000000000);
console.log(match.duration, match.radiant_win);
console.log(`${rateLimit.remainingMinute} requests left this minute`);

// Get player info
const { data: player } = await client.players.get(76561198049899734);

// Search players
const { data: results } = await client.search.players({ q: "Dendi" });
```

## Available Resources

### `client.matches`
| Method | Description |
|--------|-------------|
| `get(matchId)` | Get match data by ID |

### `client.players`
| Method | Description |
|--------|-------------|
| `get(accountId)` | Get player profile |
| `getWinLoss(accountId)` | Get win/loss record |
| `getRecentMatches(accountId, params?)` | Get recent matches |

### `client.heroes`
| Method | Description |
|--------|-------------|
| `list()` | List all heroes |

### `client.heroStats`
| Method | Description |
|--------|-------------|
| `list()` | Get aggregated hero stats |

### `client.search`
| Method | Description |
|--------|-------------|
| `players(params)` | Search for players |

### `client.explorer`
| Method | Description |
|--------|-------------|
| `query(sql)` | Run SQL queries against match data |

### `client.request`
| Method | Description |
|--------|-------------|
| `submit(matchId)` | Request a match parse (costs 10 rate limit units) |

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | — | OpenDota API key |
| `baseUrl` | `string` | `https://api.opendota.com/api` | API base URL |
| `maxRetries` | `number` | `3` | Max retries for 429/5xx |
| `retryBaseDelay` | `number` | `1000` | Base delay (ms) for backoff |
| `timeout` | `number` | `30000` | Request timeout (ms) |
| `fetch` | `typeof fetch` | `globalThis.fetch` | Custom fetch implementation |

## Error Handling
All errors throw typed subclasses:
```typescript
import { OpenDota, OpenDotaRateLimitError, OpenDotaNotFoundError } from "opendota-sdk";

try {
  const { data } = await client.matches.get(999999999);
} catch (error) {
  if (error instanceof OpenDotaNotFoundError) {
    console.log("Match not found");
  } else if (error instanceof OpenDotaRateLimitError) {
    console.log(`Rate limited. Remaining: ${error.remainingMinute}`);
  }
}
```

| Error Class | HTTP Status | Cause |
|-------------|-------------|-------|
| `OpenDotaNotFoundError` | 404 | Match/player doesn't exist |
| `OpenDotaRateLimitError` | 429 | Exceeded request limit |
| `OpenDotaServerError` | 5xx | OpenDota server issue |
| `OpenDotaError` | — | Base error class |

## Request Cancellation
```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

const { data } = await client.matches.get(12345, {
  signal: controller.signal,
});
```

## Rate Limits

Without API key: 60 requests/minute, 2,000/day.  
With API key: 300 requests/minute, unlimited daily.

Get a free key at [opendota.com/api-keys](https://www.opendota.com/api-keys).

Every response includes rate limit metadata:
```typescript
const { data, rateLimit } = await client.heroes.list();
console.log(rateLimit.remainingMinute); // e.g. 58
console.log(rateLimit.remainingDay);    // e.g. 1995 (null with API key)
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md). Run tests with `npm test`.

## License
MIT
