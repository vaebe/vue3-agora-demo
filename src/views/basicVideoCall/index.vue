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

  // 获取用户发布的视频流
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
  remoteVideoUserId.value = ''
}

const { getProjectConfig, getAgoraToken } = useProjectConfig()

const localUid = ref(1001)

let client: IAgoraRTCClient | null = null

let videoTrack: ICameraVideoTrack | null = null
let audioTrack: IMicrophoneAudioTrack | null = null

async function createBasicVideoCall() {
  // 创建客户端
  client = createClient({ mode: 'rtc', codec: 'vp8' })

  // 创建连接后需要立即开启监听,否则会无法正确监听到已加入频道的用户
  client.on('user-published', onPublished)
  client.on('user-unpublished', onUnPublished)

  // 加入频道
  const { appId, certificate } = getProjectConfig()
  const channel = '6001'
  const token = await getAgoraToken({ uid: localUid.value, channel, appId, certificate })
  await client.join(appId, channel, token, localUid.value)

  // 创建本地音频和视频轨道并发布
  videoTrack = await createCameraVideoTrack()
  audioTrack = await createMicrophoneAudioTrack()

  // 指定 video 容器
  videoTrack.play(String(localUid.value))
  // 发布视频流可以被房间内其他用户监听 user-published 获取流展示
  await client.publish([videoTrack, audioTrack])
}

function init() {
  createBasicVideoCall().then(() => {
    // 加入房间时默认开启视频及音频,如不需要可在此处理
    isCameraOn.value = true
    isMicrophoneOn.value = true
  })
}

// =======================本地音视频开关=====================================
const isCameraOn = ref(true)
const isMicrophoneOn = ref(true)

// 视频
async function toggleCamera() {
  // 判断视频是否是开启的状态,是的话就关闭否则开启
  if (!isCameraOn.value)
    await videoTrack?.setMuted(false)
  else
    await videoTrack?.setMuted(true)

  // 取反赋值
  isCameraOn.value = !isCameraOn.value
}

// 音频
async function toggleMicrophone() {
  if (!isMicrophoneOn.value)
    await audioTrack?.setMuted(false)
  else
    await audioTrack?.setMuted(true)

  isMicrophoneOn.value = !isMicrophoneOn.value
}

// 离开频道时关闭推流断开客户端连接
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

onBeforeUnmount(() => {
  leave()
})
</script>

<template>
  <el-card>
    <p class="text-xl">频道固定为: 6001</p>

    <div class="flex justify-between flex-wrap">
      <div class="w-[482px]">
        <p class="mb-2">远程画面: {{ remoteVideoUserId }}</p>
        <video id="remote-video" class="w-full h-[241px] bg-gray"></video>
      </div>
      <div class="w-[482px]">
        <p class="mb-2">本地画面: {{ localUid }}</p>
        <video :id="localUid" class="w-full h-[241px] bg-gray"></video>

        <div class="content-operation">
          <el-input v-model.number="localUid" placeholder="请输入uid" clearable></el-input>
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
