<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { ContestApi } from '@/api'
import { useContestStore } from '@/stores/contest'
import type {
  Scoreboard,
  ScoreboardContest,
  Problem,
  TeamRow,
  SubmissionResult,
  Submission
} from '@/types'
import LastSubmission from '@/components/LastSubmission.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'

import logo from '@/assets/domjudge.png'

const contestApi = new ContestApi()
const contestStore = useContestStore()

const scoreboardData = ref<Scoreboard>()

function addTimeStringToDate(currentDate: Date, timeString: string): Date {
  const [hours, minutes, seconds] = timeString.split(':').map(Number)
  const millisecondsToAdd = hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000
  currentDate.setTime(currentDate.getTime() + millisecondsToAdd)
  return currentDate
}

async function getContestName(contestId: string): Promise<ScoreboardContest> {
  const contest = await contestApi.getContest(contestId)
  const state = await contestApi.getContestState(contestId)

  const frozenDuration = contest.scoreboardFreezeDuration
  const frozenTime =
    state.frozen !== undefined
      ? new Date(state.frozen)
      : addTimeStringToDate(new Date(contest.startTime), frozenDuration)

  return {
    id: contest.id,
    name: contest.name,
    startTime: new Date(contest.startTime),
    endTime: new Date(contest.endTime),
    frozenTime: frozenTime
  }
}

async function getProblemList(contestId: string): Promise<Problem[]> {
  const problems = await contestApi.getContestProblems(contestId)
  return problems.map(
    (problem: any): Problem => ({
      id: problem.id,
      shortname: problem.shortName,
      color: problem.rgb
    })
  )
}

async function getTeamInfos(contestId: string) {
  const team = await contestApi.getTeamInfos(contestId)

  return team.map(
    (teamInfo: any): TeamRow => ({
      id: teamInfo.id,
      name: teamInfo.name,
      rank: 0,
      score: {
        numSolved: 0,
        penalty: 0
      },
      submissions: []
    })
  )
}

async function updateScoreboard(contestId: string) {
  const scoreboards = await contestApi.getScoreboard(contestId)
  if (!scoreboardData.value) return

  scoreboardData.value.teams = scoreboards.rows.map((scoreboard: any): TeamRow => {
    // TODO: optimize this
    if (!scoreboardData.value) throw new Error('scoreboardData is not initialized')

    const _originTeam = scoreboardData.value.teams.find(
      (team: any) => team.id === scoreboard.teamId
    ) as TeamRow

    return {
      ..._originTeam,
      rank: scoreboard.rank as number,
      score: {
        numSolved: scoreboard.score.numSolved,
        penalty: scoreboard.score.totalTime
      },
      submissions: scoreboard.problems.map(
        (problem: any): SubmissionResult => ({
          id: problem.label,
          numJudged: problem.numJudged,
          numPending: problem.numPending,
          penalty: problem.time,
          firstToSolve: problem.firstToSolve
        })
      )
    }
  })

  setTimeout(() => updateScoreboard(contestId), 1000)
}

async function initScoreboard(contestId: string) {
  const _data = await Promise.all([
    getContestName(contestId),
    getProblemList(contestId),
    getTeamInfos(contestId)
  ])
  scoreboardData.value = {
    contest: _data[0],
    problems: _data[1],
    teams: _data[2]
  }
  updateScoreboard(contestId)
}

const lastSubmissionData = ref<Submission[]>()
const lastSubmissionLimit = 10
async function getLastSubmission(contestId: string) {
  const lastSubmission = await contestApi.getSubmissions(contestId)
  const judgement = await contestApi.getJudgements(contestId)

  const len = lastSubmission.length
  lastSubmissionData.value = lastSubmission
    .map((submission: any): Submission => {
      // TODO: optimize this
      if (!scoreboardData.value) throw new Error('scoreboardData is not initialized')

      const team = scoreboardData.value.teams.find(
        (teamInfo: any) => teamInfo.id === submission.teamId
      )!

      const problem = scoreboardData.value.problems.find(
        (problem: any) => problem.id === submission.problemId
      )!

      const isFrozen = new Date(submission.time) >= scoreboardData.value.contest.frozenTime
      const result = isFrozen
        ? null
        : judgement.find((judge: any) => judge.submissionId === submission.id).judgementTypeId

      return {
        id: submission.id,
        teamName: team.name,
        rank: team.rank,
        problem: problem,
        numSolved: team.score.numSolved,
        result: result,
        isFrozen: isFrozen
      }
    })
    .slice(Math.max(0, len - lastSubmissionLimit), len)

  setTimeout(() => getLastSubmission(contestId), 1000)
}

const isInitialized = ref(false)
onMounted(async () => {
  const domjudgeApi = contestStore.domjudgeApi
  const contestId = contestStore.contests![0].id

  contestApi.register(domjudgeApi.url, {
    username: domjudgeApi.username,
    password: domjudgeApi.password
  })

  await initScoreboard(contestId)
  await getLastSubmission(contestId)
  isInitialized.value = true
})
</script>

<template>
  <el-row v-loading.fullscreen.lock="!isInitialized" style="overflow: hidden">
    <el-col :span="20">
      <template v-if="scoreboardData">
        <ScoreBoard :scoreboard-data="scoreboardData" />
      </template>
    </el-col>
    <el-col :span="4" v-if="lastSubmissionData">
      <LastSubmission :submissions="lastSubmissionData" />
      <el-image style="width: 100%; height: 120px; padding: 10px" :src="logo" fit="contain" />
    </el-col>
  </el-row>
</template>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
