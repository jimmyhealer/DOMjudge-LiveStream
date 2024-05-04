export interface Banner {
  href: string
  mime: string
  hash: string
  filename: string
  width: number
  height: number
}

export interface Contest {
  formalName: string
  penaltyTime: number
  // TODO: update type to Date
  startTime: string
  endTime: string
  duration: string
  scoreboardFreezeDuration: string
  id: string
  externalId: string
  name: string
  shortname: string
  allowSubmit: boolean
  warningMessage: string
  banner: Banner[]
}

export interface AuthorizationOptions {
  username: string
  password: string
}

export interface SubmissionResult {
  id: string
  numJudged: number
  numPending: number
  penalty: number | null
  firstToSolve: boolean
}

export interface Score {
  numSolved: number
  penalty: number
}

export interface TeamRow {
  id: string
  rank: number
  name: string
  score: Score
  submissions: SubmissionResult[]
}

export interface Problem {
  id: string
  shortname: string
  color: string
}

export interface ScoreboardContest {
  id: string
  name: string
  startTime: Date
  endTime: Date
  frozenTime: Date
}

export interface Scoreboard {
  contest: ScoreboardContest
  problems: Problem[]
  teams: TeamRow[]
}

export interface Submission {
  id: string
  teamName: string
  rank: number
  problem: Problem
  numSolved: number
  result: string
  isFrozen: boolean | undefined
}
