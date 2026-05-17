import Image from 'next/image'
import { Mail, MapPin, Code2 as Github, Briefcase as Linkedin, MessageCircle as Twitter, Globe, ExternalLink, Folder } from 'lucide-react'
import { PortfolioData } from '@/types/portfolio'

interface TemplateProps {
  profile: any
  data: PortfolioData
  showBadge?: boolean
}

export function DeveloperTemplate({ profile, data, showBadge }: TemplateProps) {
  const primaryColor = profile.theme_color || '#38bdf8'
  
  return (
    <div 
      className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-sky-500/30"
      style={{ '--color-primary': primaryColor } as any}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-screen">
        {/* SIDEBAR */}
        <aside className="w-full md:w-[320px] md:fixed h-auto md:h-screen p-8 md:p-12 flex flex-col items-center md:items-start md:border-r border-slate-800 bg-[#0f172a] z-10">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 ring-4 ring-slate-800 rounded-full overflow-hidden">
            <Image
              src={profile.avatar_url || '/placeholder-avatar.png'}
              alt={profile.full_name}
              width={160}
              height={160}
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center md:text-left tracking-tight">
            {profile.full_name}
          </h1>
          <p className="text-lg text-slate-400 mb-6 text-center md:text-left font-medium">
            {profile.tagline}
          </p>
          
          <div className="flex items-center gap-2 text-slate-500 mb-10 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            <span>{profile.location || data.location}</span>
          </div>

          <div className="flex gap-4 mt-auto">
            {data.links?.github && (
              <SocialLink href={data.links.github} icon={<Github className="h-5 w-5" />} />
            )}
            {data.links?.linkedin && (
              <SocialLink href={data.links.linkedin} icon={<Linkedin className="h-5 w-5" />} />
            )}
            {data.links?.twitter && (
              <SocialLink href={data.links.twitter} icon={<Twitter className="h-5 w-5" />} />
            )}
            {data.links?.email && (
              <SocialLink href={`mailto:${data.links.email}`} icon={<Mail className="h-5 w-5" />} />
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-[320px] p-8 md:p-12 lg:p-20 space-y-24">
          
          {/* ABOUT/BIO */}
          <section>
            <SectionHeading label="about" />
            <p className="text-lg md:text-xl leading-relaxed text-slate-400 font-normal">
              {profile.bio || "Full-stack developer passionate about building scalable web applications and exploring new technologies."}
            </p>
          </section>

          {/* SKILLS */}
          {data.skills?.length > 0 && (
            <section>
              <SectionHeading label="skills" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {['language', 'framework', 'tool', 'soft'].map(cat => {
                  const catSkills = data.skills.filter(s => s.category === cat)
                  if (!catSkills.length) return null
                  return (
                    <div key={cat} className="space-y-4">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500">
                        // {cat}s
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map((s, i) => (
                          <div 
                            key={i} 
                            className="px-3 py-1.5 rounded bg-slate-800/50 border border-slate-700 text-slate-300 font-mono text-sm hover:border-[var(--color-primary)] transition-colors"
                          >
                            {s.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {data.projects?.length > 0 && (
            <section>
              <SectionHeading label="projects" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.projects.map((project, i) => (
                  <article 
                    key={i} 
                    className="group p-6 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-[var(--color-primary)] transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Folder className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                      <div className="flex gap-3">
                        {project.github_url && <a href={project.github_url} className="text-slate-500 hover:text-white transition-colors"><Github className="h-5 w-5" /></a>}
                        {project.live_url && <a href={project.live_url} className="text-slate-500 hover:text-white transition-colors"><ExternalLink className="h-5 w-5" /></a>}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.map((tech, j) => (
                        <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCE */}
          {data.experience?.length > 0 && (
            <section>
              <SectionHeading label="experience" />
              <div className="space-y-12">
                {data.experience.map((exp, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-12">
                    <div className="md:w-32 pt-1">
                      <span className="text-sm font-mono text-slate-500">
                        {exp.startDate} — {exp.current ? 'NOW' : exp.endDate}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{exp.position}</h3>
                      <p className="font-mono text-[var(--color-primary)] mb-4 text-sm">{exp.company}</p>
                      <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FOOTER */}
          <footer className="pt-20 pb-10 border-t border-slate-800 text-sm text-slate-600 font-mono">
            <p>01001101 01111001 01010000 01110010 01101111 01100110 01101001 01101100 01100101 01110011</p>
            <div className="flex justify-between items-center mt-4">
              <p>© {new Date().getFullYear()} {profile.full_name}</p>
              <a href="https://myprofiles.in" className="hover:text-[var(--color-primary)] transition-colors">
                Built with MyProfiles
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

function SectionHeading({ label }: { label: string }) {
  return (
    <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3 group">
      <span style={{ color: 'var(--color-primary)' }} className="font-mono">
        &gt;
      </span>
      <span className="tracking-tight">{label}</span>
      <div className="h-px flex-1 bg-slate-800 ml-4 group-hover:bg-[var(--color-primary)] transition-colors" />
    </h2>
  )
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      className="p-2 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
    >
      {icon}
    </a>
  )
}
