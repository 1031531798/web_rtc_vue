<template>
  <a-list
    class="list-demo-action-layout"
    :bordered="false"
    :data="dataSource"
    :pagination-props="paginationProps"
  >
    <template #item="{ item }">
      <a-list-item class="list-demo-item" action-layout="vertical">
        <template #actions>
          <span><icon-heart />83</span>
          <span><icon-star />{{ item.index }}</span>
          <span class="menu-join" @click="handleJoin(item)"><icon-import />join</span>
          <span v-if="item.personNum">房间人数:{{item.personNum}}</span>
        </template>
        <template #extra>
          <div className="image-area">
            <img alt="arco-design" :src="item.imageSrc" />
          </div>
        </template>
        <a-list-item-meta
          :title="item.title"
          :description="item.description"
        >
          <template #avatar>
            <a-avatar shape="square">
              <img alt="avatar" :src="item.avatar" />
            </a-avatar>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script>
import { dateFormat } from '@/util/util'
import { defineComponent, computed } from 'vue'
import { joinRoom } from './roomEvent'

const avatarSrc = [
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/9eeb1800d9b78349b24682c3518ac4a3.png~tplv-uwbnlip3yd-webp.webp'
]
const imageSrc = [
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/29c1f9d7d17c503c5d7bf4e538cb7c4f.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/04d7bc31dd67dcdf380bc3f6aa07599f.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/1f61854a849a076318ed527c8fca1bbf.png~tplv-uwbnlip3yd-webp.webp'
]

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    const dataSource = computed(() => {
      return props.data.map((item, index) => {
        console.log(item)
        return {
          index: index,
          avatar: avatarSrc[index % avatarSrc.length],
          id: item.id,
          personNum: item.personNum,
          title: `房间号: ${item.id}`,
          description: `创建人: ${item.createUser} 创建时间: ${dateFormat(item.createDate)}`,
          imageSrc: imageSrc[index % imageSrc.length]
        }
      })
    })
    const paginationProps = computed(() => {
      return {
        defaultPageSize: 5,
        total: props.data.length
      }
    })
    function handleJoin (item) {
      joinRoom(item.id)
    }
    return {
      dataSource,
      paginationProps,
      handleJoin
    }
  }
})
</script>

<style lang="scss">
.list-demo-action-layout  {
  margin-top: 40px;
  .image-area {
    width: 183px;
    height: 119px;
    border-radius: 2px;
    overflow: hidden;
  }
  .arco-list-item-main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
  .arco-list-item-meta-title {
    text-align: left;
  }
  .list-demo-item {
    padding: 20px 0;
    border-bottom: 1px solid var(--color-fill-3);
  }
  .image-area img {
    width: 100%;
  }
  .arco-list-item-action {
    width: 100%;
    margin: 0 4px;
  }
  .arco-icon {
    margin: 0 4px;
  }
  .menu-join {
    &:hover {
      color: rgb(var(--primary-5));
    }
  }
}
</style>
