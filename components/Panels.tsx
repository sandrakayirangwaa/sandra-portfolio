'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { moreProjects, profile, projects, skillFilters, type Project, type SkillId } from '@/data/profile';
import Flow from './Flow';
import LiveSignature from './LiveSignature';
import PhotoReveal from './PhotoReveal';
import WordCycle from './WordCycle';
import { finePointer } from './motion';

export function HomePanel({ active, onGo }: { active: boolean; onGo: (r: string) => void }) {
  return (
    <div className="home">
      <h2 data-rise>Hi, I&rsquo;m {profile.firstName}.</h2>
      <div data-rise><WordCycle active={active} /></div>
      <p className="home-line" data-rise>{profile.intro}</p>
      <div data-rise><button className="pill" onClick={() => onGo('work')}>See my work</button></div>
    </div>
  );
}

function Preview({ slug }: { slug: string }) {
  if (slug === 'afyra') {
    const farms = [[42, 40], [70, 128], [112, 30], [222, 44], [240, 126], [196, 150], [88, 74], [190, 86]];
    return (
      <svg viewBox="0 0 280 180" aria-hidden="true">
        <rect width="280" height="180" fill="#176a4c" />
        {farms.map(([x, y]) => <line key={`${x}${y}`} x1={x} y1={y} x2="140" y2="92" stroke="#f7c8d4" strokeOpacity=".55" />)}
        {farms.map(([x, y]) => <circle key={`c${x}${y}`} cx={x} cy={y} r="5" fill="#f7c8d4" />)}
        <circle cx="140" cy="92" r="11" fill="#7ee0b0" />
      </svg>
    );
  }
  if (slug === 'paws') {
    return (
      <svg viewBox="0 0 280 180" aria-hidden="true">
        <rect width="280" height="180" fill="#072a20" />
        {[18, 34, 50, 66].map((r) => <circle key={r} cx="140" cy="96" r={r} fill="none" stroke="#f7c8d4" strokeOpacity={1 - r / 90} />)}
        <path d="M0 150 C50 150 60 118 100 122 S170 150 200 112 S250 86 280 92" fill="none" stroke="#7ee0b0" strokeWidth="2" />
        <circle cx="140" cy="96" r="4" fill="#f7c8d4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 280 180" aria-hidden="true">
      <rect width="280" height="180" fill="#145240" />
      <circle cx="140" cy="90" r="66" fill="none" stroke="#f7c8d4" />
      <circle cx="166" cy="84" r="14" fill="#7ee0b0" />
      <path d="M166 84 C130 60 110 58 86 62 M166 84 C130 104 112 118 92 122 M166 84 C146 90 118 90 76 90" fill="none" stroke="#f7c8d4" strokeOpacity=".7" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={84 + i * 24} y="166" width="16" height="4" fill="#7ee0b0" fillOpacity={0.3 + i * 0.17} />)}
    </svg>
  );
}

export function WorkPanel({ onGo, study }: { onGo: (r: string) => void; study: Project | null }) {
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [skill, setSkill] = useState<SkillId>('all');
  const [mounted, setMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => { if (study) setHover(null); }, [study]);

  useEffect(() => {
    if (!mounted || !preview.current || !finePointer()) return;
    const px = gsap.quickTo(preview.current, 'x', { duration: 0.5, ease: 'power3' });
    const py = gsap.quickTo(preview.current, 'y', { duration: 0.5, ease: 'power3' });
    const move = (e: PointerEvent) => { px(e.clientX); py(e.clientY); };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [mounted]);

  const mains = projects.filter((p) => skill === 'all' || p.points.some((pt) => pt.skills.includes(skill)));
  const others = moreProjects.filter((p) => skill === 'all' || p.skills.includes(skill));
  const visible = showAll || skill !== 'all' ? others : others.slice(0, 4);

  if (study) return <CaseStudy project={study} skill={skill} onBack={() => onGo('work')} onNext={onGo} />;

  return (
    <div className="work">
      <header className="panel-head">
        <h2 data-rise>Work</h2>
        <button className="badge" data-rise onClick={() => onGo('contact')} aria-label="Get in touch">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="badge-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" /></defs>
            <text><textPath href="#badge-circle">Get in touch · Get in touch · Get in touch ·</textPath></text>
          </svg>
          <span aria-hidden="true">→</span>
        </button>
      </header>

      <div className="filters" data-rise role="group" aria-label="Filter projects by skill">
        {(Object.keys(skillFilters) as SkillId[]).map((id) => (
          <button key={id} className={id === skill ? 'is-on' : ''} aria-pressed={id === skill} onClick={() => setSkill(id)}>{skillFilters[id]}</button>
        ))}
      </div>

      <h3 className="work-sub" data-rise>Main projects</h3>
      <ul className="rows">
        {mains.map((p) => (
          <li key={p.slug} data-rise>
            <a href={`#${p.slug}`} onPointerEnter={() => setHover(p.slug)} onPointerLeave={() => setHover(null)} onClick={() => setHover(null)}>
              <span className="row-text">
                <strong>{p.name}</strong>
                <span>{p.line}</span>
              </span>
              <span className="row-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
      {!!others.length && <h3 className="work-sub" data-rise>More projects</h3>}
      <ul className="more">
        {visible.map((p) => (
          <li key={p.name}>
            <a href={p.repo} target="_blank" rel="noreferrer">
              <strong>{p.name}</strong>
              <span>{p.line}</span>
            </a>
          </li>
        ))}
      </ul>
      {others.length > visible.length && <button className="show-all" onClick={() => setShowAll(true)}>Show {others.length - visible.length} more projects</button>}
      <p className="work-foot" data-rise>
        The full history is in my <a href={profile.cv} target="_blank" rel="noreferrer">CV</a>.
      </p>
      {mounted && createPortal(
        <div className={`row-preview${hover ? ' is-on' : ''}`} ref={preview} aria-hidden="true">
          {projects.map((p) => <div key={p.slug} className={hover === p.slug ? 'is-on' : ''}><Preview slug={p.slug} /></div>)}
        </div>,
        document.body,
      )}
    </div>
  );
}

function CaseStudy({ project, skill, onBack, onNext }: { project: Project; skill: SkillId; onBack: () => void; onNext: (r: string) => void }) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <article className="study">
      <button className="back" data-rise onClick={onBack}><span aria-hidden="true">←</span> All work</button>
      <header>
        {project.status && <p className="study-status" data-rise>{project.status}</p>}
        <h2 data-rise className={project.name.length > 12 ? 'is-long' : ''}>{project.name}</h2>
        <p className="study-summary" data-rise>{project.summary}</p>
        <ul className="study-stack" data-rise>{project.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        {(project.repo || project.live) && (
          <p className="study-links" data-rise>
            {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">View the code</a>}
            {project.live && <a href={project.live} target="_blank" rel="noreferrer">Open the live project</a>}
          </p>
        )}
      </header>
      {project.insight && <p className="study-insight" data-rise>{project.insight}</p>}
      {project.users && (
        <section className="study-users" aria-label="Who uses it">
          {project.users.map((u) => (
            <div key={u.name} data-rise>
              <h3>{u.name}</h3>
              <small>{u.surface}</small>
              <p>{u.text}</p>
            </div>
          ))}
        </section>
      )}
      <div data-rise><Flow key={project.slug} flow={project.flow} /></div>
      <section className="study-points" aria-label={project.pointsTitle ?? 'What I built'}>
        <h3 data-rise>{project.pointsTitle ?? 'What I built'}</h3>
        {skill !== 'all' && <p className="study-lens" data-rise>Highlighted for {skillFilters[skill].toLowerCase()}.</p>}
        <ol className={project.ordered ? 'is-ordered' : ''}>
          {project.points.map((pt) => {
            const hit = skill === 'all' || pt.skills.includes(skill);
            return <li key={pt.text} data-rise className={hit ? '' : 'is-dim'}>{pt.text}</li>;
          })}
        </ol>
      </section>
      {project.extra && (
        <section className="study-points" aria-label={project.extraTitle}>
          <h3 data-rise>{project.extraTitle}</h3>
          <p className="study-extra" data-rise>{project.extra}</p>
        </section>
      )}
      {project.results && (
        <section className="study-points" aria-label="Results">
          <h3 data-rise>Results</h3>
          <ul>{project.results.map((r) => <li key={r} data-rise>{r}</li>)}</ul>
        </section>
      )}
      <button className="next" onClick={() => onNext(next.slug)}>
        <span>Next project</span>
        <strong>{next.name}</strong>
      </button>
    </article>
  );
}

export function AboutPanel({ active }: { active: boolean }) {
  return (
    <div className="about">
      <header className="about-head">
        <PhotoReveal active={active} />
        <h2 data-rise>About</h2>
      </header>
      <div className="about-grid">
        <div className="about-statement">
          {profile.statement.map((s, i) => <p key={i} data-rise className={i === 0 ? 'is-lead' : ''}>{s}</p>)}
          <div className="about-edu" data-rise>
            <h3>Education</h3>
            {profile.education.map((e) => (
              <p key={e.school}><strong>{e.school}</strong><br />{e.course}<br /><span>{e.dates}</span></p>
            ))}
          </div>
        </div>
        <dl className="skills">
          {profile.skills.map((g) => (
            <div key={g.group} data-rise>
              <dt>{g.group}</dt>
              <dd>{g.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function ContactPanel({ active }: { active: boolean }) {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const email = useRef<HTMLElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const r = document.createRange();
      if (email.current) { r.selectNodeContents(email.current); const s = getSelection(); s?.removeAllRanges(); s?.addRange(r); }
    }
  };

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Message from ${d.get('name')}`);
    const body = encodeURIComponent(`${d.get('message')}\n\nReply to: ${d.get('from')}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setOpened(true);
  };

  return (
    <div className="contact">
      <h2 data-rise>Contact</h2>
      <p className="contact-lead" data-rise>I&rsquo;m based in Kigali. Email me, or write your message here and send it from your email app.</p>
      <div className="contact-grid">
        <div className="contact-direct" data-rise>
          <h3>Reach me directly</h3>
          <div className="contact-row">
            <span>Email</span>
            <strong ref={email}>{profile.email}</strong>
            <button onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
          {profile.links.map((l) => (
            <a key={l.label} className="contact-row" href={l.href} target="_blank" rel="noreferrer">
              <span>{l.label}</span>
              <strong>{l.href.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')}</strong>
            </a>
          ))}
          <a className="contact-row" href={profile.cv} target="_blank" rel="noreferrer"><span>CV</span><strong>Open my CV</strong></a>
        </div>
        <form onSubmit={send} data-rise>
          <h3>Write a message</h3>
          <div className="field-pair">
            <label htmlFor="c-name">Name<input id="c-name" name="name" required autoComplete="name" /></label>
            <label htmlFor="c-from">Email<input id="c-from" name="from" type="email" required autoComplete="email" /></label>
          </div>
          <label htmlFor="c-msg">Message<textarea id="c-msg" name="message" rows={5} required /></label>
          <div className="form-end">
            <button className="pill" type="submit">Open in my email app</button>
            {opened && <p role="status">If your email app did not open, copy my address and write to me there.</p>}
          </div>
        </form>
      </div>
      <LiveSignature className="contact-sign" active={active} color="#0c3b2e" />
    </div>
  );
}

