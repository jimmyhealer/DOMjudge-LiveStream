export function convertSnakeToCamel(snake: string): string {
  return snake.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  )
}

export function convertObjectKeyToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertObjectKeyToCamel(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      return {
        ...acc,
        [convertSnakeToCamel(key)]: convertObjectKeyToCamel(obj[key])
      }
    }, {})
  }
  return obj
}
