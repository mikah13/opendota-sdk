import { http, HttpResponse } from "msw";

const BASE = "https://api.opendota.com/api";

export const handlers = [
  http.get(`${BASE}/matches/:matchId`, ({ params }) => {
    return HttpResponse.json(
      { match_id: Number(params.matchId), duration: 2400 },
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "59",
          "X-Rate-Limit-Remaining-Day": "1999",
        },
      }
    );
  }),

  http.get(`${BASE}/players/:accountId`, ({ params }) => {
    return HttpResponse.json(
      { profile: { account_id: Number(params.accountId), personaname: "TestPlayer" } },
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "58",
          "X-Rate-Limit-Remaining-Day": "1998",
        },
      }
    );
  }),

  http.get(`${BASE}/players/:accountId/wl`, () => {
    return HttpResponse.json(
      { win: 100, lose: 50 },
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "57",
          "X-Rate-Limit-Remaining-Day": "1997",
        },
      }
    );
  }),

  http.get(`${BASE}/heroes`, () => {
    return HttpResponse.json(
      [
        { id: 1, localized_name: "Anti-Mage" },
        { id: 2, localized_name: "Axe" },
      ],
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "56",
          "X-Rate-Limit-Remaining-Day": "1996",
        },
      }
    );
  }),

  http.post(`${BASE}/players/:accountId/refresh`, ({ params }) => {
    return HttpResponse.json(
      { account_id: Number(params.accountId) },
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "55",
          "X-Rate-Limit-Remaining-Day": "1995",
        },
      }
    );
  }),

  http.get(`${BASE}/explorer`, ({ request }) => {
    const url = new URL(request.url);
    const sql = url.searchParams.get("sql");
    return HttpResponse.json(
      {
        command: sql,
        rowCount: 1,
        rows: [{ now: "2024-01-01" }],
        fields: [],
        err: null,
      },
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "54",
          "X-Rate-Limit-Remaining-Day": "1994",
        },
      }
    );
  }),

  http.post(`${BASE}/request/:matchId`, ({ params }) => {
    return HttpResponse.json(
      { job: { match_id: Number(params.matchId) } },
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "53",
          "X-Rate-Limit-Remaining-Day": "1993",
        },
      }
    );
  }),

  // Heroes
  http.get(`${BASE}/heroes/:heroId/matchups`, () => {
    return HttpResponse.json(
      [{ hero_id: 1, games_played: 100, wins: 55 }],
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "52",
          "X-Rate-Limit-Remaining-Day": "1992",
        },
      }
    );
  }),

  http.get(`${BASE}/heroes/:heroId/matches`, () => {
    return HttpResponse.json(
      [{ match_id: 1234567890 }],
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "51",
          "X-Rate-Limit-Remaining-Day": "1991",
        },
      }
    );
  }),

  // Teams
  http.get(`${BASE}/teams`, () => {
    return HttpResponse.json(
      [{ team_id: 1, name: "Team Secret", rating: 1500, wins: 100, losses: 50 }],
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "50",
          "X-Rate-Limit-Remaining-Day": "1990",
        },
      }
    );
  }),

  http.get(`${BASE}/teams/:teamId`, ({ params }) => {
    return HttpResponse.json(
      { team_id: Number(params.teamId), name: "Team Secret", rating: 1500, wins: 100, losses: 50 },
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "49",
          "X-Rate-Limit-Remaining-Day": "1989",
        },
      }
    );
  }),

  http.get(`${BASE}/teams/:teamId/players`, ({ params }) => {
    return HttpResponse.json(
      [{ account_id: 123, name: "s4", games_played: 500, wins: 300, is_current_team_member: true }],
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "48",
          "X-Rate-Limit-Remaining-Day": "1988",
        },
      }
    );
  }),

  // Search
  http.get(`${BASE}/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    return HttpResponse.json(
      [{ account_id: 70388657, personaname: `Result for ${q}`, avatarfull: "" }],
      {
        headers: {
          "X-Rate-Limit-Remaining-Minute": "47",
          "X-Rate-Limit-Remaining-Day": "1987",
        },
      }
    );
  }),
];
