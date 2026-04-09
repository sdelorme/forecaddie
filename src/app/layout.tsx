import type { Metadata } from 'next'
import './globals.css'
import { Header, Footer } from '@/components/shared'
import { ScrollWrapper, LiveStatsProvider, PlayerFlagsProvider } from '@/components/providers'
import { TooltipProvider } from '@/components/ui'
import { getLiveLeaderboard, getSchedule } from '@/lib/api/datagolf'
import { getCurrentEvent } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Forecaddie - Golf Statistics & Tournament Tracking',
    template: '%s | Forecaddie'
  },
  description: 'Live PGA Tour leaderboards, player rankings, and betting odds powered by DataGolf.',
  icons: {
    icon: '/Icon.png'
  },
  openGraph: {
    title: 'Forecaddie - Golf Statistics & Tournament Tracking',
    description: 'Live PGA Tour leaderboards, player rankings, and betting odds powered by DataGolf.',
    siteName: 'Forecaddie',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Forecaddie - Golf Statistics & Tournament Tracking',
    description: 'Live PGA Tour leaderboards, player rankings, and betting odds powered by DataGolf.'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [initialData, schedule] = await Promise.all([
    getLiveLeaderboard().catch(() => undefined),
    getSchedule().catch(() => [])
  ])

  const now = new Date()
  const currentEvent = getCurrentEvent(schedule, now)
  const isComplete = currentEvent?.status === 'completed'

  return (
    <html lang="en" className="h-full">
      <head>
        <Script id="freshpaint-init" strategy="beforeInteractive">
          {`(function(){function p(r,e){(e==null||e>r.length)&&(e=r.length);for(var t=0,a=new Array(e);t<e;t++)a[t]=r[t];return a}function v(r){if(Array.isArray(r))return p(r)}function h(r){if(typeof Symbol!="undefined"&&r[Symbol.iterator]!=null||r["@@iterator"]!=null)return Array.from(r)}function A(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function I(r,e){if(r){if(typeof r=="string")return p(r,e);var t=Object.prototype.toString.call(r).slice(8,-1);if(t==="Object"&&r.constructor&&(t=r.constructor.name),t==="Map"||t==="Set")return Array.from(t);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return p(r,e)}}function y(r){return v(r)||h(r)||I(r)||A()}var E=function(r,e){if(!e.__SV){try{var t,a,m=window.location,c=m.hash,x=function(n,o){return t=n.match(new RegExp(o+"=([^&]*)")),t?t[1]:null};c&&x(c,"fpState")&&(a=JSON.parse(decodeURIComponent(x(c,"fpState"))),a.action==="fpeditor"&&(window.sessionStorage.setItem("_fpcehash",c),history.replaceState(a.desiredHash||"",r.title,m.pathname+m.search)))}catch(S){}e.__loaded=!1,e.config=!1,e.__SV=2,window.freshpaint=new Proxy(e,{get:function(n,o){return n[o]!==void 0?n[o]:o==="init"?function(l,u,i){var _,d;(_=n)[d="_i"]||(_[d]=[]),n._i.push([l,u||{},i||"freshpaint"])}:function(){for(var l=arguments.length,u=new Array(l),i=0;i<l;i++)u[i]=arguments[i];var _=[o].concat(y(u));return n.push(_),new Proxy(_,{get:function(f,w){return f[w]?f[w]:function(){for(var b=arguments.length,g=new Array(b),s=0;s<b;s++)g[s]=arguments[s];f.length=0,f.push([o].concat(y(u))),f.push([w].concat(y(g)))}}})}}})}};E(document,window.freshpaint||[]);})();
window.FRESHPAINT_CUSTOM_LIB_URL="https://trk.caddie.bet/static/js/freshpaint.js";
freshpaint.init("533da14c-0e2f-4152-affb-350662f0a4e0",{"custom_domain":"https://trk.caddie.bet"});
freshpaint.page();`}
        </Script>
        <Script
          id="freshpaint-lib"
          src="https://trk.caddie.bet/js/533da14c-0e2f-4152-affb-350662f0a4e0/freshpaint.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-black text-gray-300 min-h-full flex flex-col">
        <TooltipProvider delayDuration={200}>
          <PlayerFlagsProvider eventId={currentEvent?.eventId}>
            <LiveStatsProvider initialData={initialData} isComplete={isComplete}>
              <ScrollWrapper>
                <Header />
              </ScrollWrapper>
              <div className="pt-[var(--header-h,144px)]">
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </LiveStatsProvider>
          </PlayerFlagsProvider>
        </TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
