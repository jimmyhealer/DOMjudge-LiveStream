import { ElMessage } from 'element-plus'

import { convertObjectKeyToCamel } from './utils'

class FetchTemplate {
  protected url: string

  constructor(url: string) {
    this.url = url
  }

  protected preprocessOptions(options: RequestInit): RequestInit {
    const defaultHeaders = {
      'Content-Type': 'application/json'
    }

    return {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }
  }

  private getUrlType(url: string): string {
    return url.replace('http://', '').split('/').slice(3).join('/')
  }

  protected async postprocessResponse(response: Response): Promise<any> {
    const responseData = await response.json()

    switch (response.status) {
      case 404:
        ElMessage.error(`Not Found: ${responseData.message}`)
        console.error(
          `[${new Date().toLocaleString()}][${this.getUrlType(response.url)}] ${responseData.message}`
        )
        break
    }
    return convertObjectKeyToCamel(responseData)
  }

  public async fetchApi(path: string, options: RequestInit = {}): Promise<any> {
    const processedOptions = this.preprocessOptions(options)
    const response = await fetch(`${this.url}/${path}`, {
      ...processedOptions
    })
    return this.postprocessResponse(response)
  }

  public setUrl(url: string): void {
    this.url = url
  }
}

export class DomjudgeFetch extends FetchTemplate {
  constructor() {
    super('api')
  }
}
