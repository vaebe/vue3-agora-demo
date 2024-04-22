<script setup lang="ts">
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack
} from "agora-rtc-sdk-ng/esm";
import { createCameraVideoTrack, createClient, createMicrophoneAudioTrack } from "agora-rtc-sdk-ng/esm";
import { useProjectConfig } from '@/composables'
import { onBeforeUnmount, ref } from "vue";

const remoteVideoUserId = ref('')

async function onPublished(user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') {
  remoteVideoUserId.value = user.uid.toString()

  await client!.subscribe(user, mediaType)

  if (mediaType === 'video') {
    const remoteVideoTrack = user.videoTrack

    if (remoteVideoTrack)
      remoteVideoTrack.play('remote-video')
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
  const userId = user.uid.toString()

  if (userId === '9001')
    ElMessage('老师已停止直播!')
}

function createClientListener(client: IAgoraRTCClient) {
  client.on('user-published', onPublished)
  client.on('user-unpublished', onUnPublished)
}

interface ClientJoin {
  client: IAgoraRTCClient
  uid: number
}

const { getProjectConfig, getAgoraToken } = useProjectConfig()

// 加入频道
async function clientJoin(opts: ClientJoin) {
  const { client, uid } = opts

  const { appId, certificate } = getProjectConfig()
  const appid = appId
  const channel = '6001'
  const token = await getAgoraToken({ uid, channel, appId, certificate })
  await client.join(appid, channel, token, uid)
}

const uid = ref(0)

let client: IAgoraRTCClient | null = null

interface CreateVideoOpts {
  videoDomId: string
}

let videoTrack: ICameraVideoTrack | null = null
let audioTrack: IMicrophoneAudioTrack | null = null

async function createBasicVideoCall(opts: CreateVideoOpts) {
  if (uid.value < 1) {
    ElMessage.warning('请输入 uid 且不可为 0')
    return
  }

  // 创建客户端
  client = createClient({ mode: 'rtc', codec: 'vp8' })

  // 创建连接后需要立即开启监听,否则会无法正确监听到已加入频道的用户
  createClientListener(client)

  // 加入频道
  await clientJoin({ client, uid: uid.value })

  // 创建本地音频和视频轨道并发布
  videoTrack = await createCameraVideoTrack()
  audioTrack = await createMicrophoneAudioTrack()
  videoTrack.play(opts.videoDomId)
  await client.publish([videoTrack, audioTrack])
}

const isCameraOn = ref(true)
const isMicrophoneOn = ref(true)

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
  createBasicVideoCall({ videoDomId: 'local-video' }).then(res => {
    isCameraOn.value = true
    isMicrophoneOn.value = true
  })
}

onBeforeUnmount(() => {
  leave()
})
</script>

<template>
  <el-card>
    <div class="flex justify-between flex-wrap">
      <div class="w-[482px]">
        <p class="mb-2 text-xl">远程画面: {{ remoteVideoUserId }}</p>
        <video id="remote-video" class="w-full h-[241px] bg-gray"></video>
      </div>
      <div class="w-[482px]">
        <p class="mb-2 text-xl">本地画面: {{ uid }}</p>
        <video id="local-video" class="w-full h-[241px] bg-gray"></video>

        <div class="content-operation">
          <el-input v-model.number="uid" placeholder="请输入uid" clearable></el-input>
          <el-button size="small" @click="init">
            初始化并加入频道
          </el-button>
          <el-button size="small" @click="toggleCamera">
            {{ isCameraOn ? "关闭" : "打开" }}摄像头
          </el-button>
          <el-button size="small" @click="toggleMicrophone">
            {{ isMicrophoneOn ? "关闭" : "打开" }}麦克风
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
