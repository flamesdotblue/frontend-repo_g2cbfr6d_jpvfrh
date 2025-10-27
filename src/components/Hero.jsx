import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, TrendingUp } from 'lucide-react';

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-80">
        <Spline
          scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-sm">
            <TrendingUp className="w-4 h-4 text-violet-300" />
            <span className="text-violet-100">PhonePe Transaction Insights</span>
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">
            Understand your money with beautiful, instant insights
          </h1>
          <p className="mt-4 md:mt-6 text-slate-300 leading-relaxed">
            Upload your PhonePe statements and get an at-a-glance breakdown of where your money goes — categories, trends, merchants, and more.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-500 hover:bg-violet-600 active:bg-violet-700 transition-colors px-5 py-3 text-white shadow-lg shadow-violet-500/20"
            >
              <Rocket className="w-5 h-5" />
              <span>Get Started</span>
            </button>
            <a
              href="#insights"
              className="rounded-lg border border-white/20 px-5 py-3 text-slate-200 hover:bg-white/10 transition-colors"
            >
              See a preview
            </a>
          </div>
        </div>
      </div>

      {/* Soft gradient overlays that don't block the 3D scene */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950"></div>
    </section>
  );
}
