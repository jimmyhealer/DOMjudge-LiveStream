import type { Problem } from './problem'

export interface LastSubmission {
  id: string
  teamName: string
  rank: number
  problem: Problem
  numSolved: number
  result: string | null
  isFrozen: boolean | null
}

export interface LastSubmissionDTO {
  id: string
  teamId: string
  problemId: string
  time: string
}

export interface JudgementDTO {
  submissionId: string
  judgementTypeId: string
}
