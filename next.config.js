module.exports = {
  async rewrites () {
    return [
      {
        source: '/favicon.ico',
        destination: 'https://cdn.microlink.io/logo/trim.png'
      },
      {
        source: '/:path*',
        destination: '/api/:path*'
      }
    ]
  }
}
