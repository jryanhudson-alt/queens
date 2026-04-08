import Link from "next/link";
import { CheckCircle, Zap, TrendingUp, Users, BarChart3, Star, ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get listed and start getting discovered.",
    color: "border-gray-200",
    headerColor: "bg-gray-50",
    features: [
      "Basic restaurant listing",
      "1 happy hour time slot",
      "Up to 3 menu items",
      "Standard search placement",
    ],
    notIncluded: ["Flash alerts", "Analytics", "Featured badge", "Priority placement"],
    cta: "Get Listed Free",
    href: "/owner/dashboard",
  },
  {
    name: "Standard",
    price: "$29",
    period: "/ month",
    description: "Grow your happy hour presence.",
    color: "border-blue-200",
    headerColor: "bg-blue-50",
    badge: "Most Popular",
    features: [
      "Full restaurant profile",
      "Unlimited happy hour slots",
      "Full menu with photos",
      "Enhanced search placement",
      "Basic analytics (views, clicks)",
      "Verified listing badge",
    ],
    notIncluded: ["Flash alerts", "Featured badge"],
    cta: "Start Standard",
    href: "/owner/dashboard",
  },
  {
    name: "Premium",
    price: "$79",
    period: "/ month",
    description: "Maximum visibility and real-time traffic tools.",
    color: "border-orange-300",
    headerColor: "bg-gradient-to-br from-orange-50 to-amber-50",
    badge: "Best Value",
    featured: true,
    features: [
      "Everything in Standard",
      "5 flash alerts included/month",
      "Featured badge on all listings",
      "Top search placement",
      "Full customer analytics",
      "Competitor insights",
      "Weekly performance report",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Go Premium",
    href: "/owner/dashboard",
    flashExtra: "$12/additional flash alert",
  },
];

const ADDONS = [
  {
    icon: <Zap size={20} className="text-orange-500" />,
    name: "Flash Alert Pack",
    price: "$45",
    description: "5 additional flash alerts, valid for 90 days. Send real-time deals to nearby users.",
  },
  {
    icon: <Star size={20} className="text-amber-500" />,
    name: "Day Sponsorship",
    price: "$99",
    period: "/ day",
    description: "Own the top spot in search results for a specific day. E.g. 'Sponsor Monday' — appear first every Monday.",
  },
  {
    icon: <TrendingUp size={20} className="text-blue-500" />,
    name: "Homepage Feature",
    price: "$199",
    period: "/ week",
    description: "Featured placement on the homepage banner and map. Massive visibility during peak hours.",
  },
];

function PlanCard({ plan }: { plan: typeof PLANS[0] }) {
  return (
    <div className={`bg-white rounded-2xl border-2 overflow-hidden flex flex-col ${plan.color} ${plan.featured ? "shadow-xl shadow-orange-100 scale-105" : ""}`}>
      <div className={`p-5 ${plan.headerColor}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{plan.name}</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-3xl font-black text-gray-900">{plan.price}</span>
              <span className="text-gray-500 text-sm pb-1">{plan.period}</span>
            </div>
          </div>
          {plan.badge && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              plan.featured ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
            }`}>
              {plan.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{plan.description}</p>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <ul className="space-y-2 mb-4 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
              {f}
            </li>
          ))}
          {plan.notIncluded.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-400 line-through">
              <span className="w-3.5 h-3.5 rounded-full border border-gray-200 mt-0.5 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {plan.flashExtra && (
          <p className="text-xs text-gray-400 mb-3 italic">{plan.flashExtra}</p>
        )}

        <Link
          href={plan.href}
          className={`block text-center py-3 rounded-full font-semibold text-sm transition-all ${
            plan.featured
              ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200"
              : "border border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600"
          }`}
        >
          {plan.cta}
        </Link>
      </div>
    </div>
  );
}

export default function AdvertisePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full mb-4">
          <Zap size={12} /> For Restaurant & Bar Owners
        </span>
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          Pack your bar on slow nights.<br />
          <span className="text-orange-500">Every night.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          HappyHour.app connects your venue with thousands of people actively looking for a place to drink right now.
          Flash alerts drive real foot traffic in minutes.
        </p>
      </div>

      {/* Social proof stats */}
      <div className="grid grid-cols-3 gap-6 mb-16">
        {[
          { icon: <Users size={24} />, value: "50K+", label: "Monthly active users" },
          { icon: <Zap size={24} />, value: "12,000+", label: "Flash alerts delivered" },
          { icon: <TrendingUp size={24} />, value: "3.2x", label: "Avg. traffic lift on flash nights" },
        ].map(({ icon, value, label }) => (
          <div key={label} className="text-center bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-orange-500 flex justify-center mb-2">{icon}</div>
            <p className="text-3xl font-black text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="mb-16">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Simple, honest pricing</h2>
        <p className="text-gray-500 text-center mb-10">No contracts. Cancel anytime.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => <PlanCard key={plan.name} plan={plan} />)}
        </div>
      </div>

      {/* Add-ons */}
      <div className="mb-16">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Advertising Add-ons</h2>
        <p className="text-gray-500 text-center mb-8">Available to all tiers. Pay only when you need them.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ADDONS.map((addon) => (
            <div key={addon.name} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  {addon.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{addon.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-lg font-black text-gray-900">{addon.price}</span>
                    {addon.period && <span className="text-xs text-gray-400 pb-0.5">{addon.period}</span>}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">{addon.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How flash works */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-8 mb-16 text-white">
        <h2 className="text-2xl font-black mb-2">How Flash Alerts Work</h2>
        <p className="text-white/80 mb-8">Three simple steps to fill your bar in under 10 minutes.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Write your deal", desc: "Craft a compelling message: 'Half off margaritas for the next 2 hours!'" },
            { step: "2", title: "Set your radius", desc: "Choose how far to blast — 1, 2, 5, or 10 miles from your location." },
            { step: "3", title: "Watch them arrive", desc: "Opted-in users get notified instantly. Most arrive within 30 minutes." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-white/10 rounded-2xl p-5">
              <div className="w-8 h-8 bg-white text-orange-600 font-black rounded-full flex items-center justify-center text-sm mb-3">
                {step}
              </div>
              <p className="font-bold mb-1">{title}</p>
              <p className="text-sm text-white/80">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Common Questions</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            { q: "How do flash alerts get delivered?", a: "Users who opt in to notifications receive push notifications on their phone or browser. We also show active flash deals in the app's banner and 'Live Now' feed." },
            { q: "Can I target specific demographics?", a: "Currently alerts are geo-targeted by distance from your venue. We're building interest-based targeting (e.g. only send to users who've shown interest in Mexican food or margaritas)." },
            { q: "What if my happy hour times change?", a: "You can update your listing anytime from the owner dashboard. Changes go live immediately." },
            { q: "How does HappyHour.app verify information?", a: "We use a combination of automated re-scraping, user-reported accuracy scores, and periodic manual verification by our team. Verified listings show a blue checkmark." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="font-semibold text-gray-900 mb-2">{q}</p>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gray-50 rounded-3xl p-10">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Ready to fill your bar?</h2>
        <p className="text-gray-500 mb-6">Get listed for free in under 5 minutes. No credit card required.</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/owner/dashboard"
            className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-orange-600 transition-colors"
          >
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-orange-500">
            Browse as a user →
          </Link>
        </div>
      </div>
    </div>
  );
}
