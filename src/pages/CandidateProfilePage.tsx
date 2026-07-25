import { ArrowRight, ExternalLink, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { candidateProfile } from "../data/candidate-profile";
import { Badge, Eyebrow, SectionHeading } from "../components/ui/Primitives";

export function CandidateProfilePage() {
  return (
    <div className="profile-page">
      <section className="profile-hero section-pad">
        <div>
          <Eyebrow>Candidate profile / verified source</Eyebrow>
          <h1>{candidateProfile.name}</h1>
          <p className="profile-title">{candidateProfile.title}</p>
          <p className="profile-summary">{candidateProfile.summary}</p>
          <div className="profile-meta">
            <span><MapPin size={16} />{candidateProfile.location}</span>
            <Badge tone="good">{candidateProfile.availability}</Badge>
          </div>
          <div className="hero-actions">
            <Link className="button" to="/lab">
              Match me to a role <ArrowRight size={18} />
            </Link>
            {candidateProfile.links.map((link) => (
              <a className="text-link" href={link.url} key={link.label} target="_blank" rel="noreferrer">
                {link.label} <ExternalLink size={14} />
              </a>
            ))}
          </div>
        </div>
        <div className="profile-monogram" aria-hidden>
          <span>LS</span>
          <small>Product engineer<br />Berlin area</small>
        </div>
      </section>

      <section className="section-pad profile-content">
        <aside className="profile-sidebar">
          <Eyebrow>Capabilities</Eyebrow>
          {Object.entries(candidateProfile.skills).map(([group, skills]) => (
            <div className="skill-group" key={group}>
              <h3>{group}</h3>
              <p>{skills.join(" · ")}</p>
            </div>
          ))}
          <div className="profile-fact"><span>Location</span><strong>{candidateProfile.location}</strong></div>
          <div className="profile-fact"><span>Work status</span><strong>{candidateProfile.workAuthorization}</strong></div>
        </aside>
        <div className="profile-main">
          <SectionHeading eyebrow="Selected work" title="Proof before promises." />
          <div className="project-list">
            {candidateProfile.projects.map((project, index) => (
              <article className="project-row" key={project.id}>
                <span className="project-number">0{index + 1}</span>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                  <ul>
                    {project.contribution.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <div className="tag-row">
                    {project.technologies.map((technology) => (
                      <span className="tag" key={technology}>{technology}</span>
                    ))}
                  </div>
                </div>
                <span className="evidence-ref">[{project.id.replace("project-", "").slice(0, 3).toUpperCase()}]</span>
              </article>
            ))}
          </div>

          <div className="education-block">
            <SectionHeading eyebrow="Education" title="Current learning edge." />
            {candidateProfile.education.map((item) => (
              <article key={item.id}>
                <p className="eyebrow">{item.period}</p>
                <h3>{item.degree}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}