import { HttpClient } from "./core/http.js";
import type { OpenDotaConfig } from "./types/common.js";
import { MatchesResource, PlayersResource, HeroesResource, HeroStatsResource, ProPlayersResource, ProMatchesResource, PublicMatchesResource, TeamsResource, LeaguesResource, RankingsResource, BenchmarksResource, SearchResource, ExplorerResource, RequestResource, RecordsResource, LiveResource, ScenariosResource, ConstantsResource, HealthResource, StatusResource, MetadataResource, DistributionsResource, SchemaResource } from "./resources/all.js";

export class OpenDota {
  readonly matches: MatchesResource;
  readonly players: PlayersResource;
  readonly heroes: HeroesResource;
  readonly heroStats: HeroStatsResource;
  readonly proPlayers: ProPlayersResource;
  readonly proMatches: ProMatchesResource;
  readonly publicMatches: PublicMatchesResource;
  readonly teams: TeamsResource;
  readonly leagues: LeaguesResource;
  readonly rankings: RankingsResource;
  readonly benchmarks: BenchmarksResource;
  readonly search: SearchResource;
  readonly explorer: ExplorerResource;
  readonly request: RequestResource;
  readonly records: RecordsResource;
  readonly live: LiveResource;
  readonly scenarios: ScenariosResource;
  readonly constants: ConstantsResource;
  readonly health: HealthResource;
  readonly status: StatusResource;
  readonly metadata: MetadataResource;
  readonly distributions: DistributionsResource;
  readonly schema: SchemaResource;

  constructor(config: OpenDotaConfig = {}) {
    const http = new HttpClient(config);

    this.matches = new MatchesResource(http);
    this.players = new PlayersResource(http);
    this.heroes = new HeroesResource(http);
    this.heroStats = new HeroStatsResource(http);
    this.proPlayers = new ProPlayersResource(http);
    this.proMatches = new ProMatchesResource(http);
    this.publicMatches = new PublicMatchesResource(http);
    this.teams = new TeamsResource(http);
    this.leagues = new LeaguesResource(http);
    this.rankings = new RankingsResource(http);
    this.benchmarks = new BenchmarksResource(http);
    this.search = new SearchResource(http);
    this.explorer = new ExplorerResource(http);
    this.request = new RequestResource(http);
    this.records = new RecordsResource(http);
    this.live = new LiveResource(http);
    this.scenarios = new ScenariosResource(http);
    this.constants = new ConstantsResource(http);
    this.health = new HealthResource(http);
    this.status = new StatusResource(http);
    this.metadata = new MetadataResource(http);
    this.distributions = new DistributionsResource(http);
    this.schema = new SchemaResource(http);
  }
}
