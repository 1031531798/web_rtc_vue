/**
 * 对象序列化
 */
export function serialize (data: Record<string, unknown>) {
  const list: string[] = []
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}

/**
 * 字符串反序列化
 */
export function strParse (data: string) {
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

/**
 * 格式化时间
 * 调用formatDate(strDate, 'yyyy-MM-dd');
 * @param strDate（中国标准时间、时间戳等）
 * @param strFormat（返回格式）
 */
export function dateFormat (strDate: string | number | Date, strFormat?: string) {
  if (!strDate) {
    return
  }
  if (!strFormat) {
    strFormat = 'yyyy-MM-dd'
  }
  switch (typeof strDate) {
    case 'string':
      strDate = new Date(strDate.replace(/-/, '/'))
      break
    case 'number':
      strDate = new Date(strDate)
      break
  }
  if (strDate instanceof Date) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dict: any = {
      yyyy: strDate.getFullYear(),
      M: strDate.getMonth() + 1,
      d: strDate.getDate(),
      H: strDate.getHours(),
      m: strDate.getMinutes(),
      s: strDate.getSeconds(),
      MM: ('' + (strDate.getMonth() + 101)).substring(1),
      dd: ('' + (strDate.getDate() + 100)).substring(1),
      HH: ('' + (strDate.getHours() + 100)).substring(1),
      mm: ('' + (strDate.getMinutes() + 100)).substring(1),
      ss: ('' + (strDate.getSeconds() + 100)).substring(1)
    }
    return strFormat.replace(/(yyyy|MM?|dd?|HH?|mm?|ss?)/g, function () {
      // eslint-disable-next-line prefer-rest-params
      return dict[arguments[0]]
    })
  }
}
