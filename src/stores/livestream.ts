import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as Types from '@/types'

export const useLiveStreamStore = defineStore('livestream', () => {
  const scoreboard = ref<Map<string, Types.Scoreboard>>(new Map())
  const lastSubmission = ref<Map<string, Types.LastSubmission[]>>(new Map())

  function initScoreboard(id: string): void {
    scoreboard.value.set(id, Types.ScoreboardFactory.create())
  }

  function checkScoreboard(id: string): boolean {
    return scoreboard.value.has(id)
  }

  function getScoreboard(id: string): Types.Scoreboard {
    if (!checkScoreboard(id)) {
      throw new Error(`Scoreboard ${id} not found`)
    }

    return scoreboard.value.get(id)!
  }

  function setScoreboard(data: Types.Scoreboard): void {
    scoreboard.value.set(data.contestDetail.id, data)
  }

  function getContestDetail(contestId: string): Types.ContestDetail {
    return getScoreboard(contestId)!.contestDetail
  }

  function setContestDetail(contestId: string, contest: Types.ContestDetail): void {
    getScoreboard(contestId)!.contestDetail = contest
  }

  function getProblems(contestId: string): Types.Problem[] {
    return getScoreboard(contestId)!.problems
  }

  function setProblems(contestId: string, problems: Types.Problem[]): void {
    getScoreboard(contestId)!.problems = problems
  }

  function getTeams(contestId: string): Types.Team[] {
    return getScoreboard(contestId)!.teams
  }

  function setTeams(contestId: string, teams: Types.Team[]): void {
    getScoreboard(contestId)!.teams = teams
  }

  function getLastSubmission(contestId: string): Types.LastSubmission[] {
    if (!lastSubmission.value.has(contestId)) {
      return []
    }

    return lastSubmission.value.get(contestId)!
  }

  function setLastSubmission(contestId: string, submissions: Types.LastSubmission[]): void {
    lastSubmission.value.set(contestId, submissions)
  }

  return {
    initScoreboard,
    checkScoreboard,
    getScoreboard,
    setScoreboard,
    getContestDetail,
    setContestDetail,
    getProblems,
    setProblems,
    getTeams,
    setTeams,
    getLastSubmission,
    setLastSubmission
  }
})
