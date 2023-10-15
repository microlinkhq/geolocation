/* global Response */

import { airport } from '../src/airport.js'
import { toCity } from '../src/city.js'
import { toIP } from '../src/network.js'

import countries from '../countries.json'
import airports from '../airports.json'

export const config = { runtime: 'edge' }

const isDev = process.env.NODE_ENV === 'development'

const cloudflare = path =>
  fetch(`https://api.cloudflare.com/client/v4/radar/entities/${path}`, {
    headers: {
      authorization: process.env.CLOUDFLARE_AUTHORIZATION
    }
  }).then(res => res.json())

const getAddress = isDev
  ? () => '127.0.0.1'
  : headers => headers.get('cf-connecting-ip')

const getIpCountry = isDev ? () => 'ES' : headers => headers.get('cf-ipcountry')

const getIpCity = isDev ? () => 'Murcia' : headers => headers.get('cf-ipcity')

export default async req => {
  const searchParams = new URLSearchParams(req.url.split('?')[1])

  const { headers } = req
  const countryAlpha2 = getIpCountry(headers)

  const findCountry = countries.find(({ country }) => {
    return country.alpha2 === countryAlpha2
  })

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
  } = findCountry

  const address = getAddress(headers)

  const coordinates = {
    latitude: headers.get('cf-iplatitude'),
    longitude: headers.get('cf-iplongitude')
  }

  const payload = {
    ip: toIP(address),
    city: toCity({
      name: getIpCity(headers),
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
    airport: airport(coordinates, airports),
    coordinates,
    timezone: headers.get('cf-timezone')
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
    return Response.json(payload, {
      headers: { 'access-control-allow-origin': '*' }
    })
  }

  return new Response(
    `<!DOCTYPE html><html lang="en">
  <head>
    <title>Microlink Geolocation</title>
    <meta property="og:description" content="Get detailed information about the incoming request based on the IP address." >
    <meta property="og:image" content="https://cdn.jsdelivr.net/gh/microlinkhq/geolocation/design/share.png" >
    <meta name="color-scheme" content="light dark">
    <meta charset="utf-8">
    <style>
      :root {
        --color: #000000;
        --background-color: #ffffff;
        --sh-class: #000000;
        --sh-identifier: #000000;
        --sh-sign: rgba(0, 0, 0, 0.5);
        --sh-string: #000000;
        --sh-keyword: #000000;
        --sh-comment: #000000;
        --sh-jsxliterals: #000000;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --color: #ffffff;
          --background-color: #000000;
          --sh-class: #ffffff;
          --sh-identifier: #ffffff;
          --sh-sign: rgba(255, 255, 255, 0.5);
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
        font-size: 2vmin;
        font-family: "Operator Mono", "Fira Code", "SF Mono", "Roboto Mono", Menlo,
          monospace;
        line-height: 1.5;
      }

      .github-corner svg {
        fill: var(--color);
        color: var(--background-color);
      }

      .github-corner:hover .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
      }

      @keyframes octocat-wave {

        0%,
        100% {
          transform: rotate(0);
        }

        20%,
        60% {
          transform: rotate(-25deg);
        }

        40%,
        80% {
          transform: rotate(10deg);
        }
      }
    </style>
  </head>
  <body>
    <pre>
<code>${JSON.stringify(payload, null, 2)}</code>
    </pre>
    <a href="https://github.com/microlinkhq/geolocation" target="_blank" rel="noopener noreferrer nofollow" class="github-corner" aria-label="View source on GitHub">
      <svg width="80" height="80" viewBox="0 0 250 250" style="position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
      </svg>
    </a>
    <script type="module">
      import {
        highlight
      } from 'https://esm.sh/sugar-high'
      const el = document.querySelector('pre > code')
      el.innerHTML = highlight(el.innerText)
    </script>
  </body>
</html>`,
    {
      headers: {
        'content-type': 'text/html;charset=UTF-8'
      }
    }
  )
}
