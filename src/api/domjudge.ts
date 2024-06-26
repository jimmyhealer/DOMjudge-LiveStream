import { DomjudgeFetch } from '@/api/basic'
import { cache } from '@/api/cache'
import * as Types from '@/types'

abstract class DomjudgeApi {
  protected static domjudge: DomjudgeFetch = new DomjudgeFetch()
}

export class ContestApi extends DomjudgeApi {
  @cache(60000)
  public static async getContests(
    { onlyActive }: { onlyActive?: boolean } = {
      onlyActive: false
    }
  ): Promise<Types.ContestDetailDTO[]> {
    return await DomjudgeApi.domjudge.fetchApi(`contests?onlyActive=${onlyActive}`)
  }

  @cache(60000)
  public static async getContest(id: string): Promise<Types.ContestDetailDTO> {
    return await DomjudgeApi.domjudge.fetchApi(`contests/${id}`)
  }

  @cache(60000)
  public static async getContestState(id: string): Promise<Types.ContestStateDTO> {
    return await DomjudgeApi.domjudge.fetchApi(`contests/${id}/state`)
  }

  @cache(60000)
  public static async getProblems(id: string): Promise<Types.ProblemDTO[]> {
    return await DomjudgeApi.domjudge.fetchApi(`contests/${id}/problems`)
  }

  public static async getScoreboard(id: string): Promise<Types.ScoreboardDTO> {
    return await DomjudgeApi.domjudge.fetchApi(`contests/${id}/scoreboard?public=true`)
  }

  public static async getSubmissions(contestId: string): Promise<Types.LastSubmissionDTO[]> {
    return await DomjudgeApi.domjudge.fetchApi(`contests/${contestId}/submissions`)
  }

  public static async getJudgements(contestId: string): Promise<Types.JudgementDTO[]> {
    return await DomjudgeApi.domjudge.fetchApi(`contests/${contestId}/judgements`)
  }

  @cache(60000)
  public static async getTeamInfos(contestId: string): Promise<Types.TeamDTO[]> {
    return await DomjudgeApi.domjudge.fetchApi(`contests/${contestId}/teams?public=true`)
  }

  public static async getEvents(contestId: string): Promise<any> {
    return await DomjudgeApi.domjudge.fetchApi(`contests/${contestId}/event-feed`)
  }
}
