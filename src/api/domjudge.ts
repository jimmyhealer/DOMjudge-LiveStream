import { DomjudgeFetch } from '@/api/basic'
import type { Contest, AuthorizationOptions } from '@/types'

abstract class DomjudgeApi {
  protected domjudge: DomjudgeFetch | null = null

  public register(url: string, options?: AuthorizationOptions): void {
    const { username = '', password = '' } = options || {}

    this.domjudge = new DomjudgeFetch(url, username, password)
  }
}

export class ContestApi extends DomjudgeApi {
  public async getContests(
    { onlyActive }: { onlyActive?: boolean } = {
      onlyActive: false
    }
  ): Promise<Contest[]> {
    return await this.domjudge?.fetchApi(`contests?onlyActive=${onlyActive}`)
  }

  public async getContest(id: string): Promise<Contest> {
    return await this.domjudge?.fetchApi(`contests/${id}`)
  }

  public async getContestState(id: string): Promise<any> {
    return await this.domjudge?.fetchApi(`contests/${id}/state`)
  }

  public async getContestStatus(id: string): Promise<any> {
    return await this.domjudge?.fetchApi(`contests/${id}/status`)
  }

  public async getContestProblems(id: string): Promise<any> {
    return await this.domjudge?.fetchApi(`contests/${id}/problems`)
  }

  public async getScoreboard(id: string): Promise<any> {
    return await this.domjudge?.fetchApi(`contests/${id}/scoreboard?public=true`)
  }

  public async getSubmissions(contestId: string): Promise<any> {
    return await this.domjudge?.fetchApi(`contests/${contestId}/submissions`)
  }

  public async getJudgements(contestId: string): Promise<any> {
    return await this.domjudge?.fetchApi(`contests/${contestId}/judgements`)
  }

  public async getTeamInfos(contestId: string): Promise<any> {
    return await this.domjudge?.fetchApi(`contests/${contestId}/teams?public=true`)
  }

  public async getEvents(contestId: string): Promise<any> {
    return await this.domjudge?.fetchApi(`contests/${contestId}/event-feed`)
  }
}
