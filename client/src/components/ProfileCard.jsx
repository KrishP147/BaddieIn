export default function ProfileCard({ profile, variant = 'current' }) {
  if (!profile) {
    return null;
  }

  const {
    name,
    age,
    job_title: jobTitle,
    industry,
    schedule,
    work_life_priority: workLifePriority,
    bio,
    skills = [],
    goals = [],
    compatibilityScore,
    matchType,
    reasons = [],
    looking_for: lookingFor,
  } = profile;

  const initials = (name || '??')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <article className={`profile-card profile-card--${variant}`}>
      <div className="profile-card__hero">
        <div className="profile-card__avatar" aria-hidden="true">
          {initials || '??'}
        </div>
        <div className="profile-card__headline">
          <h2>
            {name}
            {typeof age === 'number' && <span className="profile-card__age">{age}</span>}
          </h2>
          <p className="profile-card__role">
            {jobTitle}
            {industry ? ` · ${industry}` : ''}
          </p>
          <div className="profile-card__chips">
            {schedule && <span>{schedule}</span>}
            {workLifePriority && <span>{workLifePriority}</span>}
            {lookingFor && <span>Looking for · {lookingFor}</span>}
          </div>
        </div>
        {compatibilityScore != null && (
          <div className="profile-card__score" aria-label="Compatibility score">
            <div className="profile-card__score-ring">
              <span>{compatibilityScore}</span>
              <small>%</small>
            </div>
            {matchType && <p>{matchType}</p>}
          </div>
        )}
      </div>

      <div className="profile-card__body">
        {bio && (
          <section className="profile-card__section profile-card__section--bio">
            <h3>Profile Overview</h3>
            <p>{bio}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section className="profile-card__section">
            <h3>Top Skills</h3>
            <ul className="profile-card__tags">
              {skills.slice(0, 10).map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {goals.length > 0 && (
          <section className="profile-card__section profile-card__section--goals">
            <h3>Goals</h3>
            <ul>
              {goals.slice(0, 4).map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </section>
        )}

        {reasons.length > 0 && (
          <section className="profile-card__section profile-card__section--reasons">
            <h3>Match Signals</h3>
            <ul>
              {reasons.slice(0, 3).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
