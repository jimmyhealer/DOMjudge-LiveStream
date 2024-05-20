import type { Problem } from './problem'
import type { ContestDetail } from './contest'

export interface Submission {
  id: string
  numJudged: number
  numPending: number
  solved: boolean
  firstToSolve: boolean
}

export interface Score {
  numSolved: number
  penalty: number
}

export interface Team {
  id: string
  rank: number
  name: string
  score: Score
  submissions: Submission[]
}

export interface TeamDTO {
  id: string
  name: string
}

export interface Scoreboard {
  contestDetail: ContestDetail
  problems: Problem[]
  teams: Team[]
}

export class ScoreboardFactory {
  public static create(): Scoreboard {
    return {
      contestDetail: {
        id: '',
        name: '',
        startTime: new Date(),
        endTime: new Date(),
        frozenTime: new Date()
      },
      problems: [],
      teams: []
    }
  }
}

export interface ScoreboardItemDTO {
  teamId: string
  rank: number
  score: {
    numSolved: number
    totalTime: number
  }
  problems: {
    label: string
    numJudged: number
    numPending: number
    solved: boolean
    time: number | null
    firstToSolve: boolean
  }[]
}

export interface ScoreboardDTO {
  rows: ScoreboardItemDTO[]
}

export class ScoreboardMapper {
  public static toObject(sbData: ScoreboardItemDTO, teamData: TeamDTO): Team {
    if (sbData.teamId !== teamData.id) {
      throw new Error('Team ID mismatch')
    }

    return {
      id: sbData.teamId,
      rank: sbData.rank,
      name: teamData.name,
      score: {
        numSolved: sbData.score.numSolved,
        penalty: sbData.score.totalTime
      },
      submissions: sbData.problems.map((problem) => ({
        id: problem.label,
        numJudged: problem.numJudged,
        numPending: problem.numPending,
        solved: problem.solved,
        firstToSolve: problem.firstToSolve
      }))
    }
  }
}
