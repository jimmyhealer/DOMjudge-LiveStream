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
