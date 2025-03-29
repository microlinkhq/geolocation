'use strict'

const test = require('ava')
const { runServer } = require('./helpers')
const handler = require('../api')

test('/headers', async t => {
  const url = await runServer(t, handler)
  const res = await fetch(new URL('/headers?foo', url), {
    headers: {
      'x-foo': 'bar'
    }
  })

  t.is(res.status, 200)
  const headers = await res.json()
  t.is(headers['x-foo'], 'bar')
})

test('/airports', async t => {
  const url = await runServer(t, handler)
  const res = await fetch(new URL('/airports?foo', url))

  t.is(res.status, 200)

  const airports = await res.json()
  t.not(
    airports.find(({ iata }) => iata === 'ALC'),
    undefined
  )
})

test('/countries', async t => {
  const url = await runServer(t, handler)
  const res = await fetch(new URL('/countries?foo', url))

  t.is(res.status, 200)
  const countries = await res.json()

  t.not(
    countries.find(({ country }) => country.name === 'Spain'),
    undefined
  )
})

test('/countries?alpha2=es', async t => {
  const url = await runServer(t, handler)
  const res = await fetch(new URL('/countries?alpha2=es', url))

  t.is(res.status, 200)
  const data = await res.json()

  t.not(data.country.name === 'Spain', undefined)
})

test('/countries?alpha2=ES', async t => {
  const url = await runServer(t, handler)
  const res = await fetch(new URL('/countries?alpha2=ES', url))

  t.is(res.status, 200)
  const data = await res.json()

  t.not(data.country.name === 'Spain', undefined)
})

test('/countries?alpha3=es', async t => {
  const url = await runServer(t, handler)
  const res = await fetch(new URL('/countries?alpha3=esp', url))

  t.is(res.status, 200)
  const data = await res.json()

  t.not(data.country.name === 'Spain', undefined)
})

test('/ - returns html if it is supported', async t => {
  const url = await runServer(t, handler)
  const res = await fetch(url, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-encoding': 'gzip, br',
      'accept-language': 'en,es;q=0.9',
      'cache-control': 'max-age=0',
      'cdn-loop': 'cloudflare; loops=1',
      'cf-connecting-ip': '12.222.71.85',
      'cf-ipcontinent': 'NA',
      'cf-ipcountry': 'US',
      'cf-iplatitude': '34.05440',
      'cf-iplongitude': '-118.24400',
      'cf-ray': '92624e033a4bcf2d-SJC',
      'cf-region': 'California',
      'cf-region-code': 'CA',
      'cf-timezone': 'America/Los_Angeles',
      'cf-visitor': '{"scheme":"https"}',
      connection: 'Keep-Alive',
      'content-length': '2106',
      cookie: '__stripe_mid=3acef1e4-b540-4719-ae9a-eb2f207bd0128468f4',
      dnt: '1',
      host: 'geolocation.microlink.io',
      priority: 'u=0, i',
      'sec-ch-ua':
        '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'sec-gpc': '1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
      'x-forwarded-for': '172.71.154.168',
      'x-forwarded-host': 'geolocation.microlink.io',
      'x-forwarded-proto': 'https',
      'x-real-ip': '172.71.154.168',
      'x-vercel-deployment-url': 'geolocation-9y85dfykc-microlink.vercel.app',
      'x-vercel-edge-region': 'sfo1',
      'x-vercel-id': 'sfo1::w9zwr-1742946565662-b5bea3b38648',
      'x-vercel-ip-as-number': '13335',
      'x-vercel-ip-continent': 'NA',
      'x-vercel-ip-country': 'US',
      'x-vercel-ip-latitude': '37.751',
      'x-vercel-ip-longitude': '-97.822',
      'x-vercel-ip-timezone': 'America/Chicago',
      'x-vercel-ja4-digest': 't13d1412h2_e33ad33b3d25_6b314db333b6',
      'x-vercel-proxied-for': '172.71.154.168'
    }
  })

  t.is(res.status, 200)
  t.is(res.headers.get('content-type'), 'text/html;charset=utf-8')
})

test('/ - Monterey/California/United States', async t => {
  const url = await runServer(t, handler)
  const res = await fetch(url, {
    headers: {
      'accept-encoding': 'gzip, br',
      'accept-language': 'en,es;q=0.9',
      'cache-control': 'max-age=0',
      'cdn-loop': 'cloudflare; loops=1',
      'cf-connecting-ip': '12.222.71.85',
      'cf-ipcontinent': 'NA',
      'cf-ipcountry': 'US',
      'cf-iplatitude': '34.05440',
      'cf-iplongitude': '-118.24400',
      'cf-ray': '92624e033a4bcf2d-SJC',
      'cf-region': 'California',
      'cf-region-code': 'CA',
      'cf-timezone': 'America/Los_Angeles',
      'cf-visitor': '{"scheme":"https"}',
      connection: 'Keep-Alive',
      'content-length': '2106',
      cookie: '__stripe_mid=3acef1e4-b540-4719-ae9a-eb2f207bd0128468f4',
      dnt: '1',
      host: 'geolocation.microlink.io',
      priority: 'u=0, i',
      'sec-ch-ua':
        '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'sec-gpc': '1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
      'x-forwarded-for': '172.71.154.168',
      'x-forwarded-host': 'geolocation.microlink.io',
      'x-forwarded-proto': 'https',
      'x-real-ip': '172.71.154.168',
      'x-vercel-deployment-url': 'geolocation-9y85dfykc-microlink.vercel.app',
      'x-vercel-edge-region': 'sfo1',
      'x-vercel-id': 'sfo1::w9zwr-1742946565662-b5bea3b38648',
      'x-vercel-ip-as-number': '13335',
      'x-vercel-ip-continent': 'NA',
      'x-vercel-ip-country': 'US',
      'x-vercel-ip-latitude': '37.751',
      'x-vercel-ip-longitude': '-97.822',
      'x-vercel-ip-timezone': 'America/Chicago',
      'x-vercel-ja4-digest': 't13d1412h2_e33ad33b3d25_6b314db333b6',
      'x-vercel-proxied-for': '172.71.154.168'
    }
  })

  const output = await res.json()
  t.snapshot(output)
})

test('/ - Madrid/Spain', async t => {
  const url = await runServer(t, handler)
  const res = await fetch(url, {
    headers: {
      'accept-encoding': 'gzip',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'cdn-loop': 'cloudflare; subreqs=1',
      'cf-connecting-ip': '80.58.139.12',
      'cf-ew-via': '15',
      'cf-ipcountry': 'ES',
      'cf-ray': '806818c751a66a02-MAD',
      'cf-visitor': '{"scheme":"https"}',
      connection: 'Keep-Alive',
      'content-length': '1802',
      host: 'http://geolocation.microlink.io',
      referer: 'https://t.co',
      'sec-ch-ua':
        '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'cross-site',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
      'x-forwarded-for': '172.70.57.157',
      'x-forwarded-host': 'http://geolocation.microlink.io',
      'x-forwarded-proto': 'https',
      'x-real-ip': '172.70.57.157',
      'x-vercel-deployment-url':
        'http://geolocation-7iqlexylw-microlink.vercel.app',
      'x-vercel-edge-region': 'cdg1',
      'x-vercel-id': 'cdg1::45mgs-1694688917711-cc01a45ccbda',
      'x-vercel-ip-city': 'Madrid',
      'x-vercel-ip-country': 'ES',
      'x-vercel-ip-country-region': 'MD',
      'x-vercel-ip-latitude': '40.4163',
      'x-vercel-ip-longitude': '-3.6934',
      'x-vercel-ip-timezone': 'Europe/Madrid',
      'x-vercel-proxied-for': '172.70.57.157'
    }
  })

  const output = await res.json()
  t.snapshot(output)
})
