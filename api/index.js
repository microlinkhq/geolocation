/* global Response */

import countries from '../countries.json'
import { toCity } from '../src/city.js'
import { toIP } from '../src/network.js'

export const config = { runtime: 'edge' }

const baseUrl = ({ headers }) =>
  `${headers.get('x-forwarded-proto')}://${headers.get('x-forwarded-host')}`

const cloudflare = path =>
  fetch(`https://api.cloudflare.com/client/v4/radar/entities/${path}`, {
    headers: {
      authorization: process.env.CLOUDFLARE_AUTHORIZATION
    }
  }).then(res => res.json())

export default async req => {
  const { searchParams } = new URL(req.url, baseUrl(req))

  const { headers } = req
  const countryAlpha2 =
    req.headers.get('cf-ipcountry') ?? req.headers.get('x-vercel-ip-country')

  const {
    country,
    continent,
    capitals,
    callingCodes,
    currencies,
    eeaMember,
    euMember,
    languages,
    tlds
  } = countries.find(({ country }) => country.alpha2 === countryAlpha2)

  const address = headers.get('cf-connecting-ip') ?? headers.get('x-real-ip')

  const payload = {
    ip: toIP(address),
    city: toCity({
      name: headers.get('cf-ipcity') ?? headers.get('x-vercel-ip-city'),
      postalCode: headers.get('cf-postal-code') ?? null,
      metroCode: headers.get('cf-metro-code') ?? null
    }),
    country,
    continent,
    capitals,
    currencies,
    callingCodes,
    eeaMember,
    euMember,
    languages,
    tlds,
    coordinates: {
      latitude: headers.get('cf-iplatitude') ?? headers.get('x-vercel-ip-latitude'),
      longitude: headers.get('cf-iplongitude') ?? headers.get('x-vercel-ip-longitude')
    },
    timezone: headers.get('cf-timezone') ?? headers.get('x-vercel-ip-timezone')
  }

  if (searchParams.get('headers') !== null) {
    payload.headers = Object.fromEntries(req.headers)
  }

  if (searchParams.get('asn') !== null) {
    payload.asn = await cloudflare(`asns/ip?ip=${address}`)
      .then(body => body.result.asn)
      .then(asn => ({
        id: asn.asn,
        name: asn.aka || asn.name,
        company: asn.nameLong || null,
        website: asn.website || null,
        country: { name: asn.countryName, alpha2: asn.country },
        users: asn.estimatedUsers?.estimatedUsers,
        more: `https://radar.cloudflare.com/quality/as${asn.asn}`
      }))
  }

  if (!req.headers.get('accept').includes('text/html')) {
    return Response.json(payload, { headers: { 'access-control-allow-origin': '*' } })
  }

  return new Response(`
    <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta charset="utf-8">
          <style>
          :root {
            --background-color: #ffffff;
            --sh-class: #000000;
            --sh-identifier: #000000;
            --sh-sign: rgba(0,0,0,0.5);
            --sh-string: #000000;
            --sh-keyword: #000000;
            --sh-comment: #000000;
            --sh-jsxliterals: #000000;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --background-color: #000000;
              --sh-class: #ffffff;
              --sh-identifier: #ffffff;
              --sh-sign: rgba(255,255,255,0.5);
              --sh-string: #ffffff;
              --sh-keyword: #ffffff;
              --sh-comment: #ffffff;
              --sh-jsxliterals: #ffffff;
            }
          }
          body {
            background: var(--background-color);
          }
          code {
            font-size: 14px;
            font-family: "Operator Mono", "Fira Code", "SF Mono", "Roboto Mono", Menlo, monospace;
            line-height: 1.5;
          }
          </style>
        </head>
      <body>
        <pre><code>${JSON.stringify(payload, null, 2)}</code></pre>
      <script type="module">
        import { highlight } from 'https://esm.sh/sugar-high'
        const el = document.querySelector('pre > code')
        el.innerHTML = highlight(el.innerText)
      </script>
      </body>
    </html>`, {
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  })
}
