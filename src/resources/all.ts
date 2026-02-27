import type { HttpClient } from "../core/http.js";
import type { OpenDotaResponse, RequestOptions } from "../types/common.js";
import type { paths, components } from "../generated/schema.js";

// ---------------------------------------------------------------------------
// Type aliases derived from the generated schema
// ---------------------------------------------------------------------------

type MatchResponse = components["schemas"]["MatchResponse"];
type PlayersResponse = components["schemas"]["PlayersResponse"];
type PlayerWinLossResponse = components["schemas"]["PlayerWinLossResponse"];
type HeroStatsItem = paths["/heroStats"]["get"]["responses"][200]["content"]["application/json; charset=utf-8"][number];
type PlayerObject = components["schemas"]["PlayerObjectResponse"];
type MatchObject = components["schemas"]["MatchObjectResponse"];
type PublicMatch = components["schemas"]["PublicMatchesResponse"];
type TeamObject = components["schemas"]["TeamObjectResponse"];
type TeamMatch = components["schemas"]["TeamMatchObjectResponse"];
type TeamPlayer = components["schemas"]["TeamPlayersResponse"];
type TeamHero = components["schemas"]["TeamHeroesResponse"];
type LeagueObject = components["schemas"]["LeagueObjectResponse"];
type RankingsResponse = components["schemas"]["RankingsResponse"];
type BenchmarksResponse = components["schemas"]["BenchmarksResponse"];
type SearchResult = components["schemas"]["SearchResponse"];
type RecordsResult = components["schemas"]["RecordsResponse"];
type ScenarioItemTiming = components["schemas"]["ScenarioItemTimingsResponse"];
type ScenarioLaneRole = components["schemas"]["ScenarioLaneRolesResponse"];
type ScenarioMisc = components["schemas"]["ScenarioMiscResponse"];
type ConstantsResult = paths["/constants/{resource}"]["get"]["responses"][200]["content"]["application/json; charset=utf-8"];
type MetadataResult = components["schemas"]["MetadataResponse"];
type DistributionsResult = components["schemas"]["DistributionsResponse"];
type SchemaResult = components["schemas"]["SchemaResponse"];

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export class MatchesResource {
  constructor(private http: HttpClient) {}

  async get(matchId: number, options?: RequestOptions): Promise<OpenDotaResponse<MatchResponse>> {
    return this.http.get<MatchResponse>(`/matches/${matchId}`, undefined, options);
  }
}

export interface PlayerQueryParams {
  limit?: number;
  offset?: number;
  win?: 0 | 1;
  patch?: number;
  game_mode?: number;
  lobby_type?: number;
  region?: number;
  date?: number;
  lane_role?: number;
  hero_id?: number;
  is_radiant?: 0 | 1;
  included_account_id?: number;
  excluded_account_id?: number;
  with_hero_id?: number;
  against_hero_id?: number;
  significant?: 0 | 1;
  having?: number;
  sort?: string;
}

export class PlayersResource {
  constructor(private http: HttpClient) {}

  async get(accountId: number, options?: RequestOptions): Promise<OpenDotaResponse<PlayersResponse>> {
    return this.http.get<PlayersResponse>(`/players/${accountId}`, undefined, options);
  }

  async winLoss(accountId: number, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<PlayerWinLossResponse>> {
    return this.http.get<PlayerWinLossResponse>(`/players/${accountId}/wl`, query, options);
  }

  async recentMatches(accountId: number, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/recentMatches`, undefined, options);
  }

  async matches(accountId: number, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/matches`, query, options);
  }

  async heroes(accountId: number, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/heroes`, query, options);
  }

  async peers(accountId: number, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/peers`, query, options);
  }

  async pros(accountId: number, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/pros`, query, options);
  }

  async totals(accountId: number, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/totals`, query, options);
  }

  async counts(accountId: number, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/counts`, query, options);
  }

  async histograms(accountId: number, field: string, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/histograms/${field}`, query, options);
  }

  async wardmap(accountId: number, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>>> {
    return this.http.get<Record<string, never>>(`/players/${accountId}/wardmap`, query, options);
  }

  async wordcloud(accountId: number, query?: PlayerQueryParams, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>>> {
    return this.http.get<Record<string, never>>(`/players/${accountId}/wordcloud`, query, options);
  }

  async ratings(accountId: number, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/ratings`, undefined, options);
  }

  async rankings(accountId: number, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/players/${accountId}/rankings`, undefined, options);
  }

  async refresh(accountId: number, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>>> {
    return this.http.post<Record<string, never>>(`/players/${accountId}/refresh`, undefined, options);
  }
}

export class HeroesResource {
  constructor(private http: HttpClient) {}

  async list(options?: RequestOptions): Promise<OpenDotaResponse<components["schemas"]["HeroObjectResponse"][]>> {
    return this.http.get<components["schemas"]["HeroObjectResponse"][]>("/heroes", undefined, options);
  }

  async matches(heroId: number, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/heroes/${heroId}/matches`, undefined, options);
  }

  async matchups(heroId: number, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/heroes/${heroId}/matchups`, undefined, options);
  }

  async durations(heroId: number, options?: RequestOptions): Promise<OpenDotaResponse<components["schemas"]["HeroDurationsResponse"][]>> {
    return this.http.get<components["schemas"]["HeroDurationsResponse"][]>(`/heroes/${heroId}/durations`, undefined, options);
  }

  async players(heroId: number, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, never>[]>> {
    return this.http.get<Record<string, never>[]>(`/heroes/${heroId}/players`, undefined, options);
  }

  async itemPopularity(heroId: number, options?: RequestOptions): Promise<OpenDotaResponse<components["schemas"]["HeroItemPopularityResponse"]>> {
    return this.http.get<components["schemas"]["HeroItemPopularityResponse"]>(`/heroes/${heroId}/itemPopularity`, undefined, options);
  }
}

export class HeroStatsResource {
  constructor(private http: HttpClient) {}

  async list(options?: RequestOptions): Promise<OpenDotaResponse<HeroStatsItem[]>> {
    return this.http.get<HeroStatsItem[]>("/heroStats", undefined, options);
  }
}

export class ProPlayersResource {
  constructor(private http: HttpClient) {}

  async list(options?: RequestOptions): Promise<OpenDotaResponse<PlayerObject[]>> {
    return this.http.get<PlayerObject[]>("/proPlayers", undefined, options);
  }
}

export class ProMatchesResource {
  constructor(private http: HttpClient) {}

  async list(query?: { less_than_match_id?: number }, options?: RequestOptions): Promise<OpenDotaResponse<MatchObject[]>> {
    return this.http.get<MatchObject[]>("/proMatches", query, options);
  }
}

export class PublicMatchesResource {
  constructor(private http: HttpClient) {}

  async list(query?: { less_than_match_id?: number; mmr_ascending?: number; mmr_descending?: number }, options?: RequestOptions): Promise<OpenDotaResponse<PublicMatch[]>> {
    return this.http.get<PublicMatch[]>("/publicMatches", query, options);
  }
}

export class TeamsResource {
  constructor(private http: HttpClient) {}

  async list(options?: RequestOptions): Promise<OpenDotaResponse<TeamObject[]>> {
    return this.http.get<TeamObject[]>("/teams", undefined, options);
  }

  async get(teamId: number, options?: RequestOptions): Promise<OpenDotaResponse<TeamObject>> {
    return this.http.get<TeamObject>(`/teams/${teamId}`, undefined, options);
  }

  async matches(teamId: number, options?: RequestOptions): Promise<OpenDotaResponse<TeamMatch>> {
    return this.http.get<TeamMatch>(`/teams/${teamId}/matches`, undefined, options);
  }

  async players(teamId: number, options?: RequestOptions): Promise<OpenDotaResponse<TeamPlayer>> {
    return this.http.get<TeamPlayer>(`/teams/${teamId}/players`, undefined, options);
  }

  async heroes(teamId: number, options?: RequestOptions): Promise<OpenDotaResponse<TeamHero>> {
    return this.http.get<TeamHero>(`/teams/${teamId}/heroes`, undefined, options);
  }
}

export class LeaguesResource {
  constructor(private http: HttpClient) {}

  async list(options?: RequestOptions): Promise<OpenDotaResponse<LeagueObject[]>> {
    return this.http.get<LeagueObject[]>("/leagues", undefined, options);
  }

  async get(leagueId: number, options?: RequestOptions): Promise<OpenDotaResponse<LeagueObject[]>> {
    return this.http.get<LeagueObject[]>(`/leagues/${leagueId}`, undefined, options);
  }

  async matches(leagueId: number, options?: RequestOptions): Promise<OpenDotaResponse<MatchObject>> {
    return this.http.get<MatchObject>(`/leagues/${leagueId}/matches`, undefined, options);
  }

  async matchIds(leagueId: number, options?: RequestOptions): Promise<OpenDotaResponse<string[]>> {
    return this.http.get<string[]>(`/leagues/${leagueId}/match_ids`, undefined, options);
  }

  async teams(leagueId: number, options?: RequestOptions): Promise<OpenDotaResponse<TeamObject>> {
    return this.http.get<TeamObject>(`/leagues/${leagueId}/teams`, undefined, options);
  }
}

export class RankingsResource {
  constructor(private http: HttpClient) {}

  async get(query: { hero_id: number }, options?: RequestOptions): Promise<OpenDotaResponse<RankingsResponse>> {
    return this.http.get<RankingsResponse>("/rankings", query, options);
  }
}

export class BenchmarksResource {
  constructor(private http: HttpClient) {}

  async get(query: { hero_id: number }, options?: RequestOptions): Promise<OpenDotaResponse<BenchmarksResponse>> {
    return this.http.get<BenchmarksResponse>("/benchmarks", query, options);
  }
}

export class SearchResource {
  constructor(private http: HttpClient) {}

  async players(query: { q: string }, options?: RequestOptions): Promise<OpenDotaResponse<SearchResult[]>> {
    return this.http.get<SearchResult[]>("/search", query, options);
  }
}

export class ExplorerResource {
  constructor(private http: HttpClient) {}

  async query(sql: string, options?: RequestOptions): Promise<OpenDotaResponse<{
    command: string;
    rowCount: number;
    rows: Record<string, unknown>[];
    fields: Array<{ name: string; dataTypeID: number }>;
    err: string | null;
  }>> {
    return this.http.get<{
      command: string;
      rowCount: number;
      rows: Record<string, unknown>[];
      fields: Array<{ name: string; dataTypeID: number }>;
      err: string | null;
    }>("/explorer", { sql }, options);
  }
}

export class RequestResource {
  constructor(private http: HttpClient) {}

  async submit(matchId: number, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, unknown>>> {
    return this.http.post<Record<string, unknown>>(`/request/${matchId}`, undefined, options);
  }

  async status(jobId: string, options?: RequestOptions): Promise<OpenDotaResponse<Record<string, unknown>>> {
    return this.http.get<Record<string, unknown>>(`/request/${jobId}`, undefined, options);
  }
}

export class RecordsResource {
  constructor(private http: HttpClient) {}

  async get(field: string, options?: RequestOptions): Promise<OpenDotaResponse<RecordsResult[]>> {
    return this.http.get<RecordsResult[]>(`/records/${field}`, undefined, options);
  }
}

export class LiveResource {
  constructor(private http: HttpClient) {}

  async list(options?: RequestOptions): Promise<OpenDotaResponse<Record<string, unknown>[]>> {
    return this.http.get<Record<string, unknown>[]>("/live", undefined, options);
  }
}

export class ScenariosResource {
  constructor(private http: HttpClient) {}

  async itemTimings(query?: { hero_id?: number; lane_role?: number }, options?: RequestOptions): Promise<OpenDotaResponse<ScenarioItemTiming[]>> {
    return this.http.get<ScenarioItemTiming[]>("/scenarios/itemTimings", query, options);
  }

  async laneRoles(query?: { hero_id?: number; lane_role?: number }, options?: RequestOptions): Promise<OpenDotaResponse<ScenarioLaneRole[]>> {
    return this.http.get<ScenarioLaneRole[]>("/scenarios/laneRoles", query, options);
  }

  async misc(options?: RequestOptions): Promise<OpenDotaResponse<ScenarioMisc[]>> {
    return this.http.get<ScenarioMisc[]>("/scenarios/misc", undefined, options);
  }
}

export class ConstantsResource {
  constructor(private http: HttpClient) {}

  async get(resource: string, options?: RequestOptions): Promise<OpenDotaResponse<ConstantsResult>> {
    return this.http.get<ConstantsResult>(`/constants/${resource}`, undefined, options);
  }
}

export class HealthResource {
  constructor(private http: HttpClient) {}

  async get(options?: RequestOptions): Promise<OpenDotaResponse<Record<string, unknown>>> {
    return this.http.get<Record<string, unknown>>("/health", undefined, options);
  }
}

export class StatusResource {
  constructor(private http: HttpClient) {}

  async get(options?: RequestOptions): Promise<OpenDotaResponse<Record<string, unknown>>> {
    return this.http.get<Record<string, unknown>>("/status", undefined, options);
  }
}

export class MetadataResource {
  constructor(private http: HttpClient) {}

  async get(options?: RequestOptions): Promise<OpenDotaResponse<MetadataResult>> {
    return this.http.get<MetadataResult>("/metadata", undefined, options);
  }
}

export class DistributionsResource {
  constructor(private http: HttpClient) {}

  async get(options?: RequestOptions): Promise<OpenDotaResponse<DistributionsResult>> {
    return this.http.get<DistributionsResult>("/distributions", undefined, options);
  }
}

export class SchemaResource {
  constructor(private http: HttpClient) {}

  async get(options?: RequestOptions): Promise<OpenDotaResponse<SchemaResult[]>> {
    return this.http.get<SchemaResult[]>("/schema", undefined, options);
  }
}
