module.exports = {
  async rewrites () {
    return [
      {
        source: '/favicon.ico',
        destination: 'https://microlink.io/favicon.ico'
      },
      {
        source: '/:path*',
        destination: '/api/:path*'
      }
    ]
  }
}
