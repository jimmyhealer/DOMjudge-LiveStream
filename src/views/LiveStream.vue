<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'

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
import ImageCarousel from '@/components/ImageCarousel.vue'

const contestApi = new ContestApi()
const contestStore = useContestStore()

const scoreboardData = ref<Map<string, Scoreboard>>(new Map())
const scoreboardDataTimeout: Map<string, number> = new Map()
const lastSubmissionTimeout: Map<string, number> = new Map()

function addTimeStringToDate(targetDate: Date, timeString: string): Date {
  const [hours, minutes, seconds] = timeString.split(':').map(Number)
  const millisecondsToAdd = hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000
  targetDate.setTime(targetDate.getTime() + millisecondsToAdd)
  return targetDate
}

async function getContestName(contestId: string): Promise<ScoreboardContest> {
  const contest = await contestApi.getContest(contestId)
  const state = await contestApi.getContestState(contestId)

  const frozenDuration = contest.scoreboardFreezeDuration
  const frozenTime =
    state.frozen !== undefined && state.frozen !== null
      ? new Date(state.frozen)
      : frozenDuration === null
        ? new Date(contest.endTime)
        : addTimeStringToDate(new Date(contest.startTime), frozenDuration)

  if (new Date(contest.startTime) > new Date()) {
    setTimeout(() => getContestName(contestId), 60000)
  }

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

  scoreboardData.value.get(contestId)!.teams = scoreboards.rows.map((scoreboard: any): TeamRow => {
    // TODO: optimize this
    if (!scoreboardData.value) throw new Error('scoreboardData is not initialized')

    const _originTeam = scoreboardData.value
      .get(contestId)!
      .teams.find((team: any) => team.id === scoreboard.teamId) as TeamRow

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

  // if (new Date(scoreboardData.value.get(contestId)!.contest.endTime) <= new Date()) {
  // }
  scoreboardDataTimeout.set(
    contestId,
    setTimeout(() => updateScoreboard(contestId), 1000)
  )
}

async function initScoreboard(contestId: string) {
  const _data = await Promise.all([
    getContestName(contestId),
    getProblemList(contestId),
    getTeamInfos(contestId)
  ])
  scoreboardData.value?.set(contestId, {
    contest: _data[0],
    problems: _data[1],
    teams: _data[2]
  })
  await updateScoreboard(contestId)
  await getLastSubmission(contestId)
}

const lastSubmissionData = ref<Map<string, Submission[]>>(new Map())
const lastSubmissionLimit = 11
async function getLastSubmission(contestId: string) {
  const lastSubmission = await contestApi.getSubmissions(contestId)
  const judgement = await contestApi.getJudgements(contestId)

  const len = lastSubmission.length
  lastSubmissionData.value?.set(
    contestId,
    lastSubmission
      .filter((submission: any) => {
        const team = scoreboardData.value
          .get(contestId)!
          .teams.find((teamInfo: any) => teamInfo.id === submission.teamId)!

        return team !== undefined
      })
      .map((submission: any): Submission => {
        // TODO: optimize this
        if (!scoreboardData.value) throw new Error('scoreboardData is not initialized')

        const team = scoreboardData.value
          .get(contestId)!
          .teams.find((teamInfo: any) => teamInfo.id === submission.teamId)!

        if (!team) return {} as Submission

        const problem = scoreboardData.value
          .get(contestId)!
          .problems.find((problem: any) => problem.id === submission.problemId)!

        const isFrozen =
          new Date(submission.time) >= scoreboardData.value.get(contestId)!.contest.frozenTime
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
  )

  // if (new Date(scoreboardData.value.get(contestId)!.contest.endTime) <= new Date()) {
  // }
  lastSubmissionTimeout.set(
    contestId,
    setTimeout(() => getLastSubmission(contestId), 1000)
  )
}

function checkIsCountDown() {
  const now = new Date()
  const _scoreboardData = scoreboardData.value?.values()

  for (const sd of _scoreboardData!) {
    if (sd.contest.startTime > now) {
      isCountDown.value.set(sd.contest.id, true)

      setTimeout(() => {
        isCountDown.value.set(sd.contest.id, false)
        initScoreboard(sd.contest.id)
      }, sd.contest.startTime.getTime() - now.getTime())
    }
  }
}

const isInitialized = ref(false)
const isCountDown = ref<Map<string, boolean>>(new Map())
onMounted(async () => {
  const domjudgeApi = contestStore.domjudgeApi

  contestApi.register(domjudgeApi.url, {
    username: domjudgeApi.username,
    password: domjudgeApi.password
  })

  await Promise.all(contestStore.contests?.map((contest) => initScoreboard(contest.id)) || [])
  checkIsCountDown()
  isInitialized.value = true
})

onUnmounted(() => {
  isInitialized.value = false
  for (const timeout of scoreboardDataTimeout.values()) {
    clearTimeout(timeout)
  }
  for (const timeout of lastSubmissionTimeout.values()) {
    clearTimeout(timeout)
  }
})

watchEffect(() => {
  checkIsCountDown()
})
</script>

<template>
  <div class="scoreboard" style="overflow: hidden" v-loading.fullscreen.lock="!isInitialized">
    <template v-for="{ id } in contestStore.contests" :key="id">
      <el-row style="height: 50%; border: 1px solid #ccc">
        <el-countdown
          class="countdown"
          :title="'Start to contest ' + scoreboardData.get(id)?.contest.name"
          v-if="isCountDown.get(id)"
          :value="scoreboardData.get(id)?.contest.startTime"
        />
        <template v-else>
          <el-col :span="20" style="height: 100%">
            <template v-if="scoreboardData.get(id)">
              <ScoreBoard :scoreboardData="scoreboardData.get(id)!" />
            </template>
          </el-col>
          <el-col :span="4" v-if="lastSubmissionData.get(id)!" class="last-submission">
            <LastSubmission :submissions="lastSubmissionData.get(id)!" />
            <ImageCarousel v-if="contestStore.images" :images="contestStore.images" />
          </el-col>
        </template>
      </el-row>
    </template>
  </div>
</template>

<style scoped>
.scoreboard {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.last-submission {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.countdown >>> .el-statistic__head {
  text-align: center;
  font-size: 30px;
}

.countdown >>> .el-statistic__content {
  text-align: center;
  font-size: 64px;
}

.el-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

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
