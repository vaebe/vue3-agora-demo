interface ProjectConfig {
  appId: string,
  certificate: string,
}

interface GetAgoraToken {
  uid: number,
  channel: string,
  appId: string,
  certificate: string
}

export const useProjectConfig = () => {
  const appSettingsKey = 'sw-demo-app-settings-key'

  function getProjectConfig() {
    return JSON.parse(localStorage.getItem(appSettingsKey) || '{}') as ProjectConfig
  }

  function setProjectConfig(config: ProjectConfig) {
    if (!config.appId && !config.certificate) {
      return
    }

    localStorage.setItem(appSettingsKey, JSON.stringify(config))
    ElMessage.success('设置成功!')
  }

  async function getAgoraToken(config:GetAgoraToken) {
    const { uid, channel,appId, certificate } = config
    const url = 'https://toolbox.bj2.agoralab.co/v2/token/generate';
    const data = {
      appId: appId,
      appCertificate: certificate,
      channelName: channel,
      expire: 7200,
      src: "web",
      types: [1, 2],
      uid: uid
    };
    let resp:any = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    resp = await resp.json() || {}
    return resp?.data?.token || null
  }

  return {
    getProjectConfig,
    setProjectConfig,
    getAgoraToken
  }
}
