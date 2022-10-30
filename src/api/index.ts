import request from '@/router/axios'

export function getImageList () {
  return request.get('/myImage/list')
}
