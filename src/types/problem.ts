export interface Problem {
  id: string
  shortName: string
  color: string
}

export interface ProblemDTO {
  id: string
  shortName: string
  rgb: string
}

export class ProblemMapper {
  public static toObject(data: ProblemDTO): Problem {
    return {
      id: data.id,
      shortName: data.shortName,
      color: data.rgb
    }
  }
}
