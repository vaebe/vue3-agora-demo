<script setup lang="ts">
import { IAgoraRTCClient, IAgoraRTCRemoteUser} from "agora-rtc-sdk-ng/esm";
import { createClient } from "agora-rtc-sdk-ng/esm";
import { useProjectConfig } from '@/composables'
import { onBeforeUnmount, ref } from "vue";

const hostUid = ref('')
async function onPublished(user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') {
  hostUid.value = user.uid.toString()

  await client!.subscribe(user, mediaType)

  // 获取用户发布的视频流
  if (mediaType === 'video') {
    const remoteVideoTrack = user.videoTrack

    if (remoteVideoTrack)
      remoteVideoTrack.play(hostUid.value)
  }

  if (mediaType === 'audio') {
    const remoteAudioTrack = user.audioTrack

    if (remoteAudioTrack)
      remoteAudioTrack.play()
  }
}

// 创建客户端事件监听
async function onUnPublished(user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') {
  await client!.unsubscribe(user, mediaType)
  if (user.uid.toString() === hostUid.value) {
    ElMessage.success('主播停止推流')
    hostUid.value = ''
  }
}

const { getProjectConfig, getAgoraToken } = useProjectConfig()

let client: IAgoraRTCClient | null = null

async function init() {
  // 创建直播客户端设置用户角色为观众
  client = createClient({ mode: 'live', codec: 'vp8', role: 'audience' })

  // 创建连接后需要立即开启监听,否则会无法正确监听到已加入频道的用户
  client.on('user-published', onPublished)
  client.on('user-unpublished', onUnPublished)

  // 加入频道
  const { appId, certificate } = getProjectConfig()
  const channel = '6002'
  // uid 设置为0 会分配随机用户 id
  const token = await getAgoraToken({ uid: 0, channel, appId, certificate })
  await client.join(appId, channel, token, 0)
}

// 离开频道时断开客户端连接
function leave() {
  client?.leave()
  client = null
}

onBeforeUnmount(() => {
  leave()
})
</script>

<template>
  <el-card>
    <p class="text-xl mb-2">频道固定为: 6002</p>

    <div class="w-[482px]">
      <video :id="hostUid" class="w-full h-[241px] bg-gray"></video>

      <div class="content-operation">
        <el-button size="small" @click="init">
          加入房间
        </el-button>
        <el-button size="small" @click="leave">
          离开房间
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
</style>
