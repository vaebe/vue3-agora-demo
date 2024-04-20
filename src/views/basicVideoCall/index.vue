<script setup lang="ts">
import {
  ClientConfig,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IDataChannelConfig, IMicrophoneAudioTrack
} from "agora-rtc-sdk-ng";
import { createCameraVideoTrack, createClient, createMicrophoneAudioTrack } from "agora-rtc-sdk-ng/esm";
import { useProjectConfig } from '@/composables'
import { onBeforeUnmount, onMounted, ref } from "vue";


let client: IAgoraRTCClient | null = null

// 创建客户端
function initClient(opts?: ClientConfig) {
  return createClient({ mode: 'rtc', codec: 'vp8', ...opts })
}

type OnPublished = (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video' | 'datachannel', config?: IDataChannelConfig) => void

interface CreateVideoOpts {
  client: IAgoraRTCClient
  videoDomId: string
  uid?: number
  userPublished?: OnPublished
  userUnpublished?: OnPublished
}

const { getProjectConfig, getAgoraToken } = useProjectConfig()

// 创建普通直播
async function createBasicVideoCall(opts: CreateVideoOpts) {
  const client = opts.client

  opts.userPublished && client.on('user-published', opts.userPublished)
  opts.userUnpublished && client.on('user-unpublished', opts.userUnpublished)

  const { appId, certificate } = getProjectConfig()

  const appid = appId
  const channel = '6001'
  const uid = opts.uid ?? 9001
  const token = await getAgoraToken({ uid, channel, appId, certificate })

  const videoTrack = await createCameraVideoTrack()
  const audioTrack = await createMicrophoneAudioTrack()

  await client.join(appid, channel, token, uid)

  // 创建本地音频和视频轨道
  videoTrack.play(opts.videoDomId)

  await client.publish([videoTrack, audioTrack])

  return {
    client,
    videoTrack,
    audioTrack,
  }
}

const isCameraOn = ref(true)
const isMicrophoneOn = ref(true)

let videoTrack: ICameraVideoTrack | null = null
let audioTrack: IMicrophoneAudioTrack | null = null

async function toggleCamera() {
  if (!isCameraOn.value)
    await videoTrack?.setMuted(false)
  else
    await videoTrack?.setMuted(true)

  isCameraOn.value = !isCameraOn.value
}

async function toggleMicrophone() {
  if (!isMicrophoneOn.value)
    await audioTrack?.setMuted(false)
  else
    await audioTrack?.setMuted(true)

  isMicrophoneOn.value = !isMicrophoneOn.value
}

function leave() {
  videoTrack && videoTrack.close()
  videoTrack = null

  audioTrack && audioTrack.close()
  audioTrack = null

  isCameraOn.value = false
  isMicrophoneOn.value = false

  client?.leave()
  client = null
}

function init() {
  client = initClient()
  createBasicVideoCall({ client, videoDomId: 'local-video' }).then(res => {
    audioTrack = res.audioTrack
    videoTrack = res.videoTrack

    isCameraOn.value = true
    isMicrophoneOn.value = true
  })
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  leave()
})
</script>

<template>
  <el-card>
    <div class="flex justify-between">
      <div class="w5/12">
        <p class="mb-2 text-xl">远程画面</p>
        <video id="remote-video" class="w-full bg-gray"></video>
      </div>
      <div class="w5/12">
        <p class="mb-2 text-xl">本地画面</p>
        <video id="local-video" class="w-full bg-gray"></video>

        <div class="content-operation">
          <el-button size="small" @click="init">
            初始化
          </el-button>
          <el-button size="small" @click="toggleCamera">
            {{ isCameraOn ? "关闭" : "打开" }} 摄像头
          </el-button>
          <el-button size="small" @click="toggleMicrophone">
            {{ isMicrophoneOn ? "关闭" : "打开" }} 麦克风
          </el-button>
          <el-button size="small" @click="leave">
            离开频道
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
</style>
