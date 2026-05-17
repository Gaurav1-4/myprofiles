import { PortfolioData, EducationItem, ExperienceItem, ProjectItem, SkillItem } from '@/types/portfolio'
import { Badge } from '@/components/ui/badge'
import { Mail, Globe, Code2 as Github, Briefcase as Linkedin, MessageCircle as Twitter, MapPin, ExternalLink } from 'lucide-react'

// --- HERO SECTION ---
export function HeroSection({ data, theme }: { data: PortfolioData, theme: any }) {
  return (
    <section className="py-20 flex flex-col items-center text-center space-y-6">
      <h1 className="text-5xl md:text-7xl font-black tracking-tight">
        {data.full_name}
      </h1>
      {data.tagline && (
        <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl">
          {data.tagline}
        </p>
      )}
      {data.location && (
        <div className="flex items-center gap-2 text-zinc-500">
          <MapPin className="h-4 w-4" />
          <span>{data.location}</span>
        </div>
      )}
      <div className="flex gap-4 pt-4">
        {data.links?.github && (
          <a href={data.links.github} target="_blank" className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
            <Github className="h-5 w-5" />
          </a>
        )}
        {data.links?.linkedin && (
          <a href={data.links.linkedin} target="_blank" className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
        )}
        {data.links?.email && (
          <a href={`mailto:${data.links.email}`} className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
            <Mail className="h-5 w-5" />
          </a>
        )}
      </div>
    </section>
  )
}

// --- SKILLS SECTION ---
export function SkillsSection({ skills }: { skills: SkillItem[] }) {
  if (!skills.length) return null
  
  const categories = ['language', 'framework', 'tool', 'soft']
  
  return (
    <section className="py-16 space-y-8">
      <h2 className="text-3xl font-bold border-l-4 border-purple-500 pl-4">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map(cat => {
          const catSkills = skills.filter(s => s.category === cat)
          if (!catSkills.length) return null
          return (
            <div key={cat} className="space-y-4">
              <h3 className="text-sm uppercase tracking-widest text-zinc-500 font-bold">{cat}s</h3>
              <div className="flex flex-wrap gap-2">
                {catSkills.map(s => (
                  <Badge key={s.name} variant="secondary" className="px-3 py-1 bg-zinc-900/50 border-zinc-800 text-zinc-300">
                    {s.name}
                  </Badge>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// --- PROJECTS SECTION ---
export function ProjectsSection({ projects }: { projects: ProjectItem[] }) {
  if (!projects.length) return null
  return (
    <section className="py-16 space-y-8">
      <h2 className="text-3xl font-bold border-l-4 border-purple-500 pl-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <div key={i} className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-4">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(t => (
                <span key={t} className="text-[10px] uppercase font-bold text-purple-400">{t}</span>
              ))}
            </div>
            <div className="flex gap-4 pt-2">
              {project.github_url && (
                <a href={project.github_url} target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                  <Github className="h-4 w-4" />
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// --- EXPERIENCE SECTION ---
export function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  if (!items.length) return null
  return (
    <section className="py-16 space-y-8">
      <h2 className="text-3xl font-bold border-l-4 border-purple-500 pl-4">Experience</h2>
      <div className="space-y-12">
        {items.map((exp, i) => (
          <div key={i} className="relative pl-8 border-l border-zinc-800">
            <div className="absolute top-0 left-[-5px] w-[9px] h-[9px] rounded-full bg-purple-500" />
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
              <div>
                <h3 className="text-xl font-bold">{exp.position}</h3>
                <p className="text-purple-400 font-medium">{exp.company}</p>
              </div>
              <p className="text-sm text-zinc-500 font-mono">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// --- EDUCATION SECTION ---
export function EducationSection({ items }: { items: EducationItem[] }) {
  if (!items.length) return null
  return (
    <section className="py-16 space-y-8">
      <h2 className="text-3xl font-bold border-l-4 border-purple-500 pl-4">Education</h2>
      <div className="space-y-8">
        {items.map((edu, i) => (
          <div key={i} className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-lg font-bold">{edu.institution}</h3>
              <p className="text-zinc-400">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
              {edu.grade && <p className="text-sm text-zinc-500 mt-1">Grade: {edu.grade}</p>}
            </div>
            <p className="text-sm text-zinc-500 font-mono whitespace-nowrap">{edu.startDate} — {edu.endDate}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
