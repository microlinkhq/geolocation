let userConfig
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true
  },
  rewrites: () => {
    return [
      {
        source: '/favicon.ico',
        destination: 'https://cdn.microlink.io/logo/trim.png'
      }
    ]
  }
}

mergeConfig(nextConfig, userConfig)

function mergeConfig (nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key]
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
