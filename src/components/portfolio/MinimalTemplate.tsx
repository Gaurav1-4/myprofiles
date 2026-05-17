import Image from 'next/image'
import { Mail, MapPin, Code2 as Github, Briefcase as Linkedin, MessageCircle as Twitter, Globe, ExternalLink } from 'lucide-react'
import { PortfolioData } from '@/types/portfolio'

interface TemplateProps {
  profile: any
  data: PortfolioData
  showBadge?: boolean
}

export function MinimalTemplate({ profile, data, showBadge }: TemplateProps) {
  const primaryColor = profile.theme_color || '#8b5cf6'
  
  return (
    <div 
      className="min-h-screen bg-white text-zinc-900 font-inter"
      style={{ '--color-primary': primaryColor } as any}
    >
      <div className="max-w-[720px] mx-auto px-6 py-20 md:py-32">
        {/* HERO SECTION */}
        <header className="flex flex-col items-center text-center mb-24">
          <div className="relative w-32 h-32 mb-8">
            <Image
              src={profile.avatar_url || '/placeholder-avatar.png'}
              alt={profile.full_name}
              width={128}
              height={128}
              className="rounded-full object-cover grayscale-[20%] border-4 border-zinc-50"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black mb-4">
            {profile.full_name}
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-4" style={{ color: 'var(--color-primary)' }}>
            {profile.tagline}
          </p>
          <div className="flex items-center gap-2 text-zinc-500 mb-8 font-medium">
            <MapPin className="h-4 w-4" />
            <span>{profile.location || data.location}</span>
          </div>
          <div className="flex gap-5">
            {data.links?.github && (
              <a href={data.links.github} target="_blank" className="text-zinc-400 hover:text-black transition-colors">
                <Github className="h-6 w-6" />
              </a>
            )}
            {data.links?.linkedin && (
              <a href={data.links.linkedin} target="_blank" className="text-zinc-400 hover:text-black transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {data.links?.twitter && (
              <a href={data.links.twitter} target="_blank" className="text-zinc-400 hover:text-black transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            )}
            {data.links?.email && (
              <a href={`mailto:${data.links.email}`} className="text-zinc-400 hover:text-black transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            )}
          </div>
        </header>

        {/* SKILLS SECTION */}
        {data.skills?.length > 0 && (
          <section className="mb-20">
            <SectionHeader label="Skills" />
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span 
                  key={i} 
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(var(--color-primary-rgb, 139, 92, 246), 0.08)',
                    color: 'var(--color-primary)'
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {data.projects?.length > 0 && (
          <section className="mb-20">
            <SectionHeader label="Projects" />
            <div className="grid grid-cols-1 gap-8">
              {data.projects.map((project, i) => (
                <article key={i} className="group p-6 rounded-xl border border-zinc-100 bg-zinc-50/30 hover:border-zinc-200 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-black">{project.title}</h3>
                    <div className="flex gap-3">
                      {project.github_url && <a href={project.github_url} className="text-zinc-400 hover:text-black"><Github className="h-5 w-5" /></a>}
                      {project.live_url && <a href={project.live_url} className="text-zinc-400 hover:text-black"><ExternalLink className="h-5 w-5" /></a>}
                    </div>
                  </div>
                  <p className="text-zinc-600 mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, j) => (
                      <span key={j} className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {data.experience?.length > 0 && (
          <section className="mb-20">
            <SectionHeader label="Experience" />
            <div className="space-y-12">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-zinc-100">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-zinc-200" />
                  <div className="flex flex-col md:flex-row md:justify-between mb-2">
                    <h3 className="text-lg font-bold text-black">{exp.position}</h3>
                    <span className="text-sm font-medium text-zinc-500">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>{exp.company}</p>
                  <p className="text-zinc-600 leading-relaxed text-sm whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION SECTION */}
        {data.education?.length > 0 && (
          <section className="mb-20">
            <SectionHeader label="Education" />
            <div className="space-y-8">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h3 className="text-lg font-bold text-black">{edu.institution}</h3>
                    <span className="text-sm text-zinc-500">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <p className="text-zinc-600">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="mt-32 pt-8 border-t border-zinc-100 text-center">
          <a 
            href="https://myprofiles.in" 
            target="_blank"
            className="text-sm font-medium text-zinc-400 hover:text-black transition-colors"
          >
            Made with <span className="font-bold text-black">MyProfiles</span>
          </a>
        </footer>
      </div>
    </div>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 whitespace-nowrap">
        {label}
      </h2>
      <div className="w-full h-px bg-zinc-100" />
    </div>
  )
}
