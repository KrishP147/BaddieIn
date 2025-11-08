import { useCallback, useEffect, useMemo, useState } from 'react';
import SwipeDeck from './components/SwipeDeck.jsx';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';
const ACTIVE_PROFILE_ID = import.meta.env.VITE_PROFILE_ID ?? '';
const MAX_MATCHES = Number(import.meta.env.VITE_MAX_MATCHES ?? 25);

const FALLBACK_PROFILES = [
  {
    profile_id: 'fallback-1',
    name: 'Alex Rivera',
    age: 29,
    job_title: 'Product Designer',
    industry: 'Technology',
    schedule: 'Flexible',
    work_life_priority: 'Balanced',
    skills: ['UX Research', 'Figma', 'Design Systems'],
    goals: ['Launch a mentoring program', 'Design inclusive products'],
    bio: 'Design lead focused on creating equitable experiences for career changers and underrepresented talent.',
    looking_for: 'Ambitious leaders who value mentorship and collaboration.',
    compatibilityScore: 87,
    matchType: 'Work-Life Balance Match',
    reasons: ['Shared balanced work-life priorities', 'Overlapping design skills', 'Aligned mentorship goals'],
  },
  {
    profile_id: 'fallback-2',
    name: 'Jordan Lee',
    age: 33,
    job_title: 'Revenue Operations Manager',
    industry: 'SaaS',
    schedule: 'Standard',
    work_life_priority: 'Work-focused',
    skills: ['RevOps', 'HubSpot', 'SQL'],
    goals: ['Scale GTM operations', 'Build cross-functional alignment'],
    bio: 'Ops pro powering Series B startups; I turn chaos into predictable growth engines.',
    looking_for: 'Founders and leaders who thrive on scale, experimentation, and sharp feedback loops.',
    compatibilityScore: 75,
    matchType: 'Ambition Match',
    reasons: ['Ambition levels within 1 point', 'Complementary ops skills', 'Shared growth mindset'],
  },
  {
    profile_id: 'fallback-3',
    name: 'Priya Patel',
    age: 27,
    job_title: 'Healthcare Data Scientist',
    industry: 'Healthcare',
    schedule: 'Hybrid',
    work_life_priority: 'Life-focused',
    skills: ['Python', 'Machine Learning', 'Clinical Analytics'],
    goals: ['Build ethical AI for patient outcomes', 'Collaborate with mission-driven founders'],
    bio: 'Building models that actually help clinicians. Off-hours I’m climbing, reading Ursula Le Guin, or teaching girls who code.',
    looking_for: 'Impact-first leaders who see tech as a lever for systemic change.',
    compatibilityScore: 92,
    matchType: 'Industry Match',
    reasons: ['Same healthcare focus', 'Shared machine learning skills', 'Aligned mission-driven goals'],
  },
];

function normalizeMatch(match) {
  if (!match) return null;
  const baseProfile = match.profile ?? match;
  return {
    ...baseProfile,
    compatibilityScore: match.compatibility_score ?? baseProfile.compatibilityScore,
    matchType: match.match_type ?? baseProfile.matchType,
    reasons: match.reasons ?? baseProfile.reasons ?? [],
  };
}

function normalizeProfiles(response) {
  if (!response || typeof response !== 'object') {
    return [];
  }

  if (Array.isArray(response.matches)) {
    return response.matches.map((match) => normalizeMatch(match)).filter(Boolean);
  }

  if (Array.isArray(response.profiles)) {
    return response.profiles.map((profile) => normalizeMatch(profile)).filter(Boolean);
  }

  return [];
}

export default function App() {
  const [status, setStatus] = useState('Checking server status...');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const profileIdDisplay = useMemo(() => {
    if (!ACTIVE_PROFILE_ID) {
      return 'Preview mode · set VITE_PROFILE_ID to sync likes';
    }
    return `Active profile · ${ACTIVE_PROFILE_ID}`;
  }, []);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const healthResponse = await fetch(`${API_URL}/api/health`);
      if (healthResponse.ok) {
        const data = await healthResponse.json();
        setStatus(`Server online · ${data.message ?? 'Ready to mingle'}`);
      } else {
        setStatus(`Server reachable but returned ${healthResponse.status}`);
      }
    } catch (err) {
      setStatus('Backend unavailable · using sample profiles');
    }

    try {
      let payload;
      if (ACTIVE_PROFILE_ID) {
        const response = await fetch(`${API_URL}/api/match/find`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile_id: ACTIVE_PROFILE_ID,
            max_results: MAX_MATCHES,
          }),
        });

        if (!response.ok) {
          throw new Error(`Match endpoint returned ${response.status}`);
        }

        payload = await response.json();
      } else {
        const response = await fetch(`${API_URL}/api/profiles`);
        if (!response.ok) {
          throw new Error(`Profiles endpoint returned ${response.status}`);
        }
        payload = await response.json();
      }

      const normalized = normalizeProfiles(payload);
      if (normalized.length === 0) {
        setProfiles(FALLBACK_PROFILES);
        setError('No profiles yet · showing curated matches');
      } else {
        setProfiles(normalized);
      }
    } catch (err) {
      console.error(err);
      setError(err.message ?? 'Failed to load profiles');
      setProfiles(FALLBACK_PROFILES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSwipe = useCallback(
    async (direction, profile) => {
      if (!profile) return;

      if (!ACTIVE_PROFILE_ID) {
        setFeedback('Preview mode: add VITE_PROFILE_ID to sync likes with the backend.');
        return;
      }

      const isLike = direction === 'right';
      const endpoint = isLike ? '/api/match/like' : '/api/match/pass';
      const body = isLike
        ? { liker_id: ACTIVE_PROFILE_ID, liked_id: profile.profile_id }
        : { passer_id: ACTIVE_PROFILE_ID, passed_id: profile.profile_id };

      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const data = await response.json();
        if (isLike && data.is_match) {
          setFeedback(`🎉 It's a match with ${profile.name}!`);
        } else if (isLike) {
          setFeedback(`You liked ${profile.name}`);
        } else {
          setFeedback(`You passed on ${profile.name}`);
        }
      } catch (err) {
        console.error(err);
        setFeedback('Something went wrong while talking to the server.');
      }
    },
    [],
  );

  return (
    <div className="app">
      <div className="app__backdrop" aria-hidden="true" />

      <header className="app__header">
        <div className="app__logo" aria-label="LinkedIn-inspired logo">
          <span className="app__logo-text">linked</span>
          <span className="app__logo-badge">IN</span>
          <span className="app__logo-tail">match</span>
        </div>
        <div className="app__header-meta">
          <p>{status}</p>
          <span>{profileIdDisplay}</span>
        </div>
      </header>

      <main className="app__main">
        <aside className="app__sidebar">
          <div className="app__panel app__panel--primary">
            <h2>Elite Matcher</h2>
            <p>Curated deal-flow for your professional dating life. Swipe to shortlist the top LinkedIn baddies.</p>
          </div>

          {error && (
            <div className="app__panel app__panel--warning">
              <h3>Heads up</h3>
              <p>{error}</p>
            </div>
          )}

          {feedback && (
            <div className="app__panel app__panel--info">
              <h3>Activity</h3>
              <p>{feedback}</p>
            </div>
          )}

          <button type="button" className="app__cta" onClick={fetchProfiles} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh matches'}
          </button>

          <p className="app__tip">
            Configure <code>VITE_API_URL</code>, <code>VITE_PROFILE_ID</code>, and <code>VITE_MAX_MATCHES</code> in <code>client/.env.local</code> to sync with your
            FastAPI backend.
          </p>
        </aside>

        <section className="app__deck" aria-live="polite">
          {loading ? (
            <div className="app__loader">
              <span className="app__loader-ring" />
              <p>Fetching profiles...</p>
            </div>
          ) : (
            <SwipeDeck
              profiles={profiles}
              onSwipe={handleSwipe}
              disabled={loading}
              onDeckEmpty={() => setFeedback('You made it through the whole deck!')}
            />
          )}
        </section>
      </main>
    </div>
  );
}

