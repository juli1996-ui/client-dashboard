// Active campaign data for Cain McQuinley.
// Keyed by client ID. When Supabase is back, this should move to a `campaigns_data`
// column on the clients table.

export const CAIN_CLIENT_ID = '47097ab6-0ca6-49ea-8d94-c8bdf9809048'

export const CAIN_CAMPAIGNS = [
  {
    id: 'c1',
    code: 'C1',
    name: 'Health Creators + Fitness Pros',
    leads: [
      {
        name: 'Sion Monty',
        description: 'UK fitness coach, 239K IG, SMCoaching app — 1M+ audience',
        notes: 'Actively looking for a partner to recommend.',
        priority: 'high',
      },
      {
        name: 'Pavel Stuchlik / NOA|AON',
        description: 'Breathwork + biohacking entrepreneur, shared stages w/ Asprey, Chopra',
        notes: 'Confirmed 40K email list + 200K social.',
        priority: 'high',
      },
      {
        name: 'Brittany Ford / Biohacking Brittany',
        description: "Top 1% podcast in women's longevity + peptides",
        notes: 'Wants kit and partnership details. Direct ICP.',
        priority: 'high',
      },
      {
        name: 'Dr. Andrea Salcedo',
        description: 'OB/GYN at Loma Linda; runs Conscious Gynecology',
        notes: 'Send me info, interested in learning always.',
        priority: 'medium',
      },
      {
        name: 'Frank Ring',
        description: 'Walking for Health and Fitness, 140+ podcast eps; senior demo',
        notes: 'Self-scheduling a call today.',
        priority: 'high',
      },
      {
        name: 'Scott Carney',
        description: "NYT bestseller, What Doesn't Kill Us",
        notes: 'Open to honest review if we send the kit. Big reach but skeptical reviewer.',
        priority: 'medium',
      },
      {
        name: 'Keely',
        description: 'kigs27677@gmail.com',
        notes: 'Generic "yes, want to learn more"; qualify on call.',
        priority: 'low',
      },
      {
        name: 'Heather Wauthion',
        description: 'TikTok creator, managed by Rapture Mind',
        notes: 'Manager says paid partnerships only. Skip unless paid placement is open.',
        priority: 'skip',
      },
    ],
  },
  {
    id: 'c2',
    code: 'C2',
    name: 'Local Health Businesses',
    leads: [
      {
        name: 'Sharolyn Dihigo, DNP',
        description: 'NTX Integrative Health',
        notes: 'Wants more info on peptides. NP at integrative practice = direct ICP.',
        priority: 'high',
      },
      {
        name: 'Iris Wolfson, CNM/CRNP',
        description: "Holistic women's health, Philadelphia, since 1981",
        notes: 'Call slot confirmed.',
        priority: 'high',
      },
      {
        name: 'Dr. Insel',
        description: 'Cardiologist',
        notes: 'Wants starter kit details.',
        priority: 'medium',
      },
      {
        name: 'Dr. Howard',
        description: 'Chiropractor',
        notes: 'Call already being scheduled with Sofia.',
        priority: 'high',
      },
      {
        name: 'Lindsey / High Desert Health Coaching',
        description: '',
        notes: 'Auto-responder. Skip.',
        priority: 'skip',
      },
    ],
  },
  {
    id: 'c3',
    code: 'C3',
    name: 'Medical Sales Reps',
    leads: [
      {
        name: 'Mike Lytle / Barricaid',
        description: 'FDA-approved spinal implant, spine-surgery channel',
        notes: "Yes, let's discuss.",
        priority: 'high',
      },
      {
        name: 'G. Lande / Surgical Theater',
        description: 'XR surgical visualization; Mayo, Stanford, Mt. Sinai customers',
        notes: 'Yes. Please.',
        priority: 'high',
      },
    ],
  },
]
