export interface ContestDetail {
  startTime: Date
  endTime: Date
  frozenTime: Date
  id: string
  name: string
}

export interface ContestDetailDTO {
  startTime: string
  endTime: string
  scoreboardFreezeDuration: string
  id: string
  name: string
}

export class ContestMapper {
  public static toObject(data: ContestDetailDTO): ContestDetail {
    return {
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      frozenTime: new Date(data.endTime),
      id: data.id,
      name: data.name
    }
  }
}

export interface ContestState {
  frozen: Date | null
}

export interface ContestStateDTO {
  frozen: string | null
}

export class ContestStateMapper {
  public static toObject(data: ContestStateDTO): ContestState {
    return {
      frozen: data.frozen ? new Date(data.frozen) : null
    }
  }
}
