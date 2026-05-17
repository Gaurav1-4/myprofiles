'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { portfolioDataSchema, PortfolioData } from '@/lib/validations/portfolio.schema'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Link as LinkIcon, Briefcase, FolderCode, Cpu, GraduationCap, 
  ChevronDown, Plus, Edit2, Trash2, ExternalLink, Check, Loader2, Eye, X, ChevronRight, ChevronLeft,
  Mail, Globe
} from 'lucide-react'
import { MinimalTemplate } from '@/components/portfolio/MinimalTemplate'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProfileEditorProps {
  data: Partial<PortfolioData>
  onChange: (data: Partial<PortfolioData>) => void
  onNext: () => void
  onBack: () => void
  isSaving?: boolean
}

export function ProfileEditor({ data, onChange, onNext, onBack, isSaving = false }: ProfileEditorProps) {
  const [openSection, setOpenSection] = useState<string | null>('Personal Info')
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<PortfolioData>({
    resolver: zodResolver(portfolioDataSchema) as any,
    defaultValues: {
      full_name: data.full_name || '',
      tagline: data.tagline || '',
      bio: data.bio || '',
      location: data.location || '',
      education: data.education || [],
      experience: data.experience || [],
      projects: data.projects || [],
      skills: data.skills || [],
      achievements: data.achievements || [],
      links: data.links || {},
    }
  })

  // CRITICAL: When AI-extracted data arrives via props, reset the form to show it
  const hasReset = useRef(false)
  useEffect(() => {
    if (data && data.full_name && !hasReset.current) {
      reset({
        full_name: data.full_name || '',
        tagline: data.tagline || '',
        bio: data.bio || '',
        location: data.location || '',
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        skills: data.skills || [],
        achievements: data.achievements || [],
        links: data.links || {},
      })
      hasReset.current = true
    }
  }, [data, reset])

  // Watch all changes to trigger auto-save upstream
  const watchAllFields = useWatch({ control })
  useEffect(() => {
    if (Object.keys(watchAllFields).length > 0) {
      onChange(watchAllFields as Partial<PortfolioData>)
    }
  }, [JSON.stringify(watchAllFields)])

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id)
  }

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experience' })
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' })
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control, name: 'projects' })
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: 'skills' })

  const previewData = watchAllFields as PortfolioData

  return (
    <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="flex flex-col lg:flex-row min-h-[750px] relative">
        
        {/* Left Column: Editor (Increased to 50% for readability) */}
        <section className="w-full lg:w-1/2 flex flex-col border-r border-white/5 bg-black/20">
          {/* Editor Header */}
          <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
                <Edit2 className="w-5 h-5 text-purple-500" />
                PROFILE EDITOR
              </h1>
            </div>
            
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
              isSaving ? "bg-purple-500/10 text-purple-400" : "bg-emerald-500/10 text-emerald-400"
            )}>
              {isSaving ? (
                <><Loader2 className="w-3 h-3 animate-spin" /> Auto-Saving</>
              ) : (
                <><Check className="w-3 h-3" /> Sync Saved</>
              )}
            </div>
          </header>

          {/* Accordion Container */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4 max-h-[calc(100vh-250px)] scrollbar-hide">
            <form onSubmit={handleSubmit(onNext)} className="space-y-4">
              
              <EditorSection 
                id="Personal Info" title="Identity" icon={<User className="w-5 h-5" />}
                isOpen={openSection === 'Personal Info'} onToggle={() => toggleSection('Personal Info')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Full Name" placeholder="Arthur Sterling" {...register('full_name')} error={errors.full_name?.message} />
                  <InputField label="Location" placeholder="San Francisco, CA" {...register('location')} />
                </div>
                <InputField label="Tagline" placeholder="Senior Systems Architect" {...register('tagline')} />
                <div className="space-y-2 w-full">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Bio / Summary</label>
                  <textarea 
                    rows={4} placeholder="Brief professional summary in first person..."
                    className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.03] text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all resize-none placeholder:text-zinc-700"
                    {...register('bio')}
                  />
                </div>
              </EditorSection>

              <EditorSection 
                id="Links" title="Connect" icon={<LinkIcon className="w-5 h-5" />}
                isOpen={openSection === 'Links'} onToggle={() => toggleSection('Links')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Email" icon={<Mail className="w-3 h-3"/>} placeholder="hello@example.com" {...register('links.email')} />
                  <InputField label="Portfolio URL" icon={<Globe className="w-3 h-3"/>} placeholder="https://..." {...register('links.portfolio')} />
                  <InputField label="GitHub" placeholder="github.com/username" {...register('links.github')} />
                  <InputField label="LinkedIn" placeholder="linkedin.com/in/username" {...register('links.linkedin')} />
                </div>
              </EditorSection>

              <EditorSection 
                id="Experience" title="Career" icon={<Briefcase className="w-5 h-5" />}
                isOpen={openSection === 'Experience'} onToggle={() => toggleSection('Experience')}
              >
                <div className="space-y-6">
                  {expFields.map((field, index) => (
                    <div key={field.id} className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-4 relative group hover:bg-white/[0.04] transition-colors">
                      <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 text-zinc-600 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4 pr-8">
                        <InputField label="Company" placeholder="Acme Corp" {...register(`experience.${index}.company`)} />
                        <InputField label="Position" placeholder="Lead Developer" {...register(`experience.${index}.position`)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Start" placeholder="Jan 2022" {...register(`experience.${index}.startDate`)} />
                        <InputField label="End" placeholder="Present" {...register(`experience.${index}.endDate`)} />
                      </div>
                      <div className="space-y-2 w-full">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Key Responsibilities</label>
                        <textarea 
                          rows={2} placeholder="Impact and achievements..."
                          className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-black/20 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all resize-none placeholder:text-zinc-700"
                          {...register(`experience.${index}.description`)}
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendExp({ company: '', position: '', description: '', startDate: '', current: false })} className="w-full py-6 mt-2 flex items-center justify-center gap-3 rounded-3xl border border-dashed border-zinc-800 text-zinc-500 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all font-black text-[10px] uppercase tracking-[0.3em]">
                    <Plus className="w-4 h-4" /> New Career Milestone
                  </button>
                </div>
              </EditorSection>

              <EditorSection 
                id="Education" title="Education" icon={<GraduationCap className="w-5 h-5" />}
                isOpen={openSection === 'Education'} onToggle={() => toggleSection('Education')}
              >
                <div className="space-y-6">
                  {eduFields.map((field, index) => (
                    <div key={field.id} className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-4 relative group hover:bg-white/[0.04] transition-colors">
                      <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 text-zinc-600 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4 pr-8">
                        <InputField label="Institution" placeholder="IIT Delhi" {...register(`education.${index}.institution`)} />
                        <InputField label="Degree" placeholder="B.Tech" {...register(`education.${index}.degree`)} />
                      </div>
                      <InputField label="Field of Study" placeholder="Computer Science" {...register(`education.${index}.fieldOfStudy`)} />
                      <div className="grid grid-cols-3 gap-4">
                        <InputField label="Start" placeholder="2020" {...register(`education.${index}.startDate`)} />
                        <InputField label="End" placeholder="2024" {...register(`education.${index}.endDate`)} />
                        <InputField label="Grade" placeholder="9.2 CGPA" {...register(`education.${index}.grade`)} />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendEdu({ institution: '', degree: '' })} className="w-full py-6 mt-2 flex items-center justify-center gap-3 rounded-3xl border border-dashed border-zinc-800 text-zinc-500 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all font-black text-[10px] uppercase tracking-[0.3em]">
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>
              </EditorSection>

              <EditorSection 
                id="Projects" title="Projects" icon={<FolderCode className="w-5 h-5" />}
                isOpen={openSection === 'Projects'} onToggle={() => toggleSection('Projects')}
              >
                <div className="space-y-6">
                  {projectFields.map((field, index) => (
                    <div key={field.id} className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-4 relative group hover:bg-white/[0.04] transition-colors">
                      <button type="button" onClick={() => removeProject(index)} className="absolute top-4 right-4 text-zinc-600 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <InputField label="Project Title" placeholder="MyProfiles" {...register(`projects.${index}.title`)} />
                      <div className="space-y-2 w-full">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Description</label>
                        <textarea 
                          rows={3} placeholder="What does this project do?"
                          className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-black/20 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all resize-none placeholder:text-zinc-700"
                          {...register(`projects.${index}.description`)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="GitHub URL" placeholder="https://github.com/..." {...register(`projects.${index}.github_url`)} />
                        <InputField label="Live URL" placeholder="https://..." {...register(`projects.${index}.live_url`)} />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendProject({ title: '', description: '', technologies: [] })} className="w-full py-6 mt-2 flex items-center justify-center gap-3 rounded-3xl border border-dashed border-zinc-800 text-zinc-500 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all font-black text-[10px] uppercase tracking-[0.3em]">
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                </div>
              </EditorSection>

              <EditorSection 
                id="Skills" title="Capabilities" icon={<Cpu className="w-5 h-5" />}
                isOpen={openSection === 'Skills'} onToggle={() => toggleSection('Skills')}
              >
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {skillFields.map((field, index) => (
                      <motion.span 
                        layout
                        key={field.id} 
                        className="inline-flex items-center gap-3 pl-4 pr-2 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-white group"
                      >
                        <input {...register(`skills.${index}.name`)} className="bg-transparent border-none outline-none w-24 text-white" placeholder="Skill name" />
                        <button type="button" onClick={() => removeSkill(index)} className="text-zinc-600 hover:text-rose-500 p-1 rounded-full hover:bg-rose-500/10 transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                  <button type="button" onClick={() => appendSkill({ name: '', category: 'tool' })} className="w-full py-6 mt-2 flex items-center justify-center gap-3 rounded-3xl border border-dashed border-zinc-800 text-zinc-500 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all font-black text-[10px] uppercase tracking-[0.3em]">
                    <Plus className="w-4 h-4" /> Add Skill Tag
                  </button>
                </div>
              </EditorSection>

              <div className="pt-8 flex justify-between gap-4">
                <Button type="button" variant="ghost" onClick={onBack} className="flex-1 h-14 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
                <Button type="submit" className="flex-[2] h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-[10px]">
                  Continue to Style <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

            </form>
          </div>
        </section>

        {/* Right Column: Sticky Preview (50% on Desktop) */}
        <aside className="hidden lg:block lg:w-1/2 h-full sticky top-0 bg-[#050505] p-12 overflow-hidden pointer-events-none">
          <div className="w-full h-full rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative group">
            {/* Browser Header */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-900/30">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black tracking-[0.2em] text-zinc-500 flex items-center gap-2 uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Canvas
              </div>
              <div className="w-8 h-8" />
            </div>
            
            {/* Actual Preview Content - Responsive Scaling */}
            <div className="flex-1 overflow-hidden relative bg-white">
               <div className="absolute inset-0 transform origin-top lg:scale-[0.85] xl:scale-[0.95] transition-transform duration-700 overflow-y-auto scrollbar-hide">
                  <MinimalTemplate 
                    profile={{ 
                      full_name: previewData.full_name || 'Your Name', 
                      tagline: previewData.tagline || 'Professional Tagline', 
                      location: previewData.location 
                    }} 
                    data={previewData} 
                  />
               </div>
            </div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-20" />
          </div>
        </aside>

        {/* Mobile Preview FAB */}
        <button 
          onClick={() => setShowPreviewModal(true)}
          className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-8 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-95 transition-all"
        >
          <Eye className="w-5 h-5" /> Live Preview
        </button>

        {/* Mobile Preview Modal */}
        <AnimatePresence>
          {showPreviewModal && (
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col"
            >
              <div className="h-20 border-b border-zinc-100 flex items-center justify-between px-8">
                <span className="font-black text-[10px] uppercase tracking-[0.3em] text-black">Mobile Preview</span>
                <button onClick={() => setShowPreviewModal(false)} className="w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-full text-black">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                 <MinimalTemplate 
                   profile={{ 
                     full_name: previewData.full_name || 'Your Name', 
                     tagline: previewData.tagline || 'Professional Tagline', 
                     location: previewData.location 
                   }} 
                   data={previewData} 
                 />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const EditorSection = ({ title, icon, isOpen, onToggle, children }: any) => (
  <div className={cn(
    "border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500",
    isOpen ? "bg-white/[0.03] border-purple-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)]" : "bg-transparent hover:bg-white/[0.02]"
  )}>
    <button 
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-8 py-6 text-left"
    >
      <div className="flex items-center gap-5">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
          isOpen ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "bg-zinc-900 text-zinc-500"
        )}>
          {icon}
        </div>
        <span className={cn(
          "font-bold tracking-tight transition-colors duration-500",
          isOpen ? "text-white text-lg" : "text-zinc-400"
        )}>{title}</span>
      </div>
      <div className={cn(
        "w-8 h-8 rounded-full border border-white/5 flex items-center justify-center transition-all duration-500",
        isOpen ? "bg-white/10 rotate-180" : "bg-transparent"
      )}>
        <ChevronDown className={cn("w-4 h-4 transition-colors", isOpen ? "text-white" : "text-zinc-600")} />
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="px-8 pb-8 space-y-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

const InputField = React.forwardRef(({ label, icon, placeholder, type = "text", error, ...props }: any, ref) => (
  <div className="space-y-2 w-full">
    <div className="flex items-center gap-2 ml-1">
      {icon && <span className="text-zinc-500">{icon}</span>}
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</label>
    </div>
    <input 
      type={type}
      ref={ref}
      placeholder={placeholder}
      className={cn(
        "w-full px-5 py-4 rounded-2xl border bg-black/20 text-white text-sm focus:outline-none transition-all duration-300 placeholder:text-zinc-700",
        error ? "border-rose-500/50 focus:border-rose-500" : "border-white/5 focus:border-purple-500/50 focus:bg-white/[0.05]"
      )}
      {...props}
    />
    {error && (
      <motion.span 
        initial={{ opacity: 0, y: -5 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-[10px] font-bold text-rose-500 ml-2"
      >
        {error}
      </motion.span>
    )}
  </div>
))
InputField.displayName = 'InputField'
