import { ContestApi } from '@/api'
import { useLiveStreamStore } from '@/stores/livestream'
import * as Types from '@/types'

const MAX_LAST_SUBMISSIONS_LIST = 10
export function useLastSubmission(contestId: string) {
  const { getContestDetail, getProblems, getTeams, setLastSubmission } = useLiveStreamStore()

  async function getLastSubmission(): Promise<void> {
    const lastSubmissionDTO = await ContestApi.getSubmissions(contestId)
    const judgementsDTO = await ContestApi.getJudgements(contestId)
    const teamsDTO = await ContestApi.getTeamInfos(contestId)
    const contestDetail = getContestDetail(contestId)
    const teams = getTeams(contestId)
    const problems = getProblems(contestId)

    let result = lastSubmissionDTO
      .filter((submission) => {
        // Filter out submissions that are not in the public contest
        const submissionTime = new Date(submission.time)
        return (
          teamsDTO.some((team) => team.id === submission.teamId) &&
          submissionTime >= contestDetail.startTime &&
          submissionTime <= contestDetail.endTime
        )
      })
      .map((submission): Types.LastSubmission => {
        const team = teams.find((team) => team.id === submission.teamId)
        const problem = problems.find((problem) => problem.id === submission.problemId)
        const judgeResult = judgementsDTO.find((judge) => judge.submissionId === submission.id)
        const submissionTime = new Date(submission.time)

        if (!problem || !team || !judgeResult) {
          throw new Error('Submission data not found')
        }

        const isFrozen = submissionTime >= contestDetail.frozenTime
        const result = isFrozen ? null : judgeResult.judgementTypeId

        return {
          id: submission.teamId,
          teamName: team.name,
          rank: team.rank,
          problem: problem,
          numSolved: team.score.numSolved,
          result: result,
          isFrozen: isFrozen
        }
      })

    result = result.slice(Math.max(result.length - MAX_LAST_SUBMISSIONS_LIST, 0), result.length)
    setLastSubmission(contestId, result)
  }

  return {
    getLastSubmission
  }
}
