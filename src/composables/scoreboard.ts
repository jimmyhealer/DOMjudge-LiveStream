import { ContestApi } from '@/api'
import { useLiveStreamStore } from '@/stores/livestream'
import * as Types from '@/types'

export function useScoreboard(contestId: string) {
  const { setContestDetail, setProblems, setTeams } = useLiveStreamStore()

  function processTimeStringToDate(targetDate: Date, timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(':').map(Number)
    const milliseconds = hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000
    targetDate.setTime(targetDate.getTime() - milliseconds)
    return targetDate
  }

  async function getContest(): Promise<void> {
    const contestDTO = await ContestApi.getContest(contestId)
    const stateDTO = await ContestApi.getContestState(contestId)

    const contest = Types.ContestMapper.toObject(contestDTO)
    const state = Types.ContestStateMapper.toObject(stateDTO)

    const frozenDuration = contestDTO.scoreboardFreezeDuration
    const frozenTime = state.frozen
      ? state.frozen
      : frozenDuration
        ? processTimeStringToDate(contest.endTime, frozenDuration)
        : contest.endTime

    const result = {
      id: contest.id,
      name: contest.name,
      startTime: contest.startTime,
      endTime: contest.endTime,
      frozenTime: frozenTime
    }

    setContestDetail(contestId, result)
  }

  async function getProblemList(): Promise<void> {
    const problemsDTO = await ContestApi.getProblems(contestId)
    setProblems(contestId, problemsDTO.map(Types.ProblemMapper.toObject))
  }

  async function getScoreboard(): Promise<void> {
    const scoreboardDTO = await ContestApi.getScoreboard(contestId)
    const teamInfosDTO = await ContestApi.getTeamInfos(contestId)

    const teams = scoreboardDTO.rows.map((sbData) => {
      const teamInfo = teamInfosDTO.find((team) => team.id === sbData.teamId)
      if (!teamInfo) {
        throw new Error('Team info not found')
      }

      return Types.ScoreboardMapper.toObject(sbData, teamInfo)
    })

    setTeams(contestId, teams)
  }

  return {
    getContest,
    getProblemList,
    getScoreboard
  }
}
