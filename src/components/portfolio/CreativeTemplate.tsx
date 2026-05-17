import Image from 'next/image'
import { Mail, MapPin, Code2 as Github, Briefcase as Linkedin, MessageCircle as Twitter, Globe, ExternalLink } from 'lucide-react'
import { PortfolioData } from '@/types/portfolio'

interface TemplateProps {
  profile: any
  data: PortfolioData
  showBadge?: boolean
}

export function CreativeTemplate({ profile, data, showBadge }: TemplateProps) {
  const primaryColor = profile.theme_color || '#6366f1'
  
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      <style>{`
        @keyframes hero-blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-hero-blob { animation: hero-blob 12s infinite alternate ease-in-out; }
      `}</style>

      {/* HERO SECTION */}
      <section 
        className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}, #312e81)`,
          '--color-primary': primaryColor 
        } as any}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-3xl animate-hero-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl animate-hero-blob" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
          <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full p-1 bg-white/20 backdrop-blur-sm mb-8 ring-4 ring-white/30 overflow-hidden">
            <Image
              src={profile.avatar_url || '/placeholder-avatar.png'}
              alt={profile.full_name}
              width={176}
              height={176}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.9] mb-6 drop-shadow-sm">
            {profile.full_name}
          </h1>
          <p className="text-xl md:text-3xl font-medium text-white/90 max-w-2xl leading-tight mb-10">
            {profile.tagline}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {data.links?.github && (
              <SocialBadge href={data.links.github} icon={<Github className="h-5 w-5" />} label="GitHub" />
            )}
            {data.links?.linkedin && (
              <SocialBadge href={data.links.linkedin} icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" />
            )}
            {data.links?.email && (
              <SocialBadge href={`mailto:${data.links.email}`} icon={<Mail className="h-5 w-5" />} label="Email" />
            )}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        
        {/* SKILLS */}
        {data.skills?.length > 0 && (
          <section className="mb-32">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-3" style={{ color: primaryColor }}>Expertise</h2>
            <h3 className="text-4xl font-bold tracking-tight mb-10">Crafting experiences with...</h3>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, i) => (
                <CategoryBadge key={i} skill={skill} />
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {data.projects?.length > 0 && (
          <section className="mb-32">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-3" style={{ color: primaryColor }}>Portfolio</h2>
            <h3 className="text-4xl font-bold tracking-tight mb-12">Selected Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {data.projects.map((project, i) => {
                const isLarge = i % 3 === 0;
                return (
                  <article 
                    key={i} 
                    className={`group flex flex-col rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 ${isLarge ? 'md:col-span-8' : 'md:col-span-4'}`}
                  >
                    <div className="relative h-64 md:h-80 overflow-hidden bg-slate-50">
                      <div 
                        className="w-full h-full opacity-10" 
                        style={{ background: `linear-gradient(to bottom right, ${primaryColor}, white)` }} 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-6xl font-black text-slate-100 uppercase tracking-tighter opacity-20 select-none">
                           {project.title.substring(0, 2)}
                         </span>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 flex-1 flex flex-col">
                      <h4 className="text-2xl font-bold mb-4 group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-slate-600 leading-relaxed mb-6 flex-1 text-sm md:text-base">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech, j) => (
                          <span key={j} className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {project.github_url && <a href={project.github_url} className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-black transition-colors"><Github className="h-5 w-5" /></a>}
                        {project.live_url && <a href={project.live_url} className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-black transition-colors"><ExternalLink className="h-5 w-5" /></a>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {data.experience?.length > 0 && (
          <section className="mb-32">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-3" style={{ color: primaryColor }}>Journey</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {data.experience.map((exp, i) => (
                <div key={i} className="flex gap-6 items-start">
                   <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center bg-slate-50 font-black text-slate-300">
                     0{i+1}
                   </div>
                   <div>
                     <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                     <p className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: primaryColor }}>{exp.company}</p>
                     <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                   </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="mt-40 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            {(profile.full_name || 'Portfolio').split(' ')[0]}<span style={{ color: primaryColor }}>.</span>
          </span>
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Made with</span>
            <a href="https://myprofiles.in" className="text-sm font-bold hover:opacity-80 transition-opacity">MyProfiles</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function CategoryBadge({ skill }: { skill: any }) {
  const styles = {
    language: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    framework: 'bg-violet-50 text-violet-700 border-violet-100',
    tool: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    soft: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  const category = (skill.category || 'tool') as keyof typeof styles;

  return (
    <span className={`px-5 py-2 rounded-full text-xs font-bold tracking-tight border ${styles[category] || styles.tool}`}>
      {skill.name}
    </span>
  );
}

function SocialBadge({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      className="px-6 py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 font-bold text-sm transition-all backdrop-blur-md border border-white/20 flex items-center gap-2"
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </a>
  );
}
