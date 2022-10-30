/**
 * 对象序列化
 */
export function serialize (data: any) {
  const list: string[] = []
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}
