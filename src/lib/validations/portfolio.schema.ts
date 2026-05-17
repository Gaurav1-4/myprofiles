import { z } from 'zod'

export const educationItemSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(100),
  degree: z.string().min(1, 'Degree is required').max(100),
  fieldOfStudy: z.string().max(100).optional().or(z.literal('')),
  startDate: z.string().max(30).optional().or(z.literal('')),
  endDate: z.string().max(30).optional().or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
  grade: z.string().max(20).optional().or(z.literal('')),
})

export const experienceItemSchema = z.object({
  company: z.string().min(1, 'Company is required').max(100),
  position: z.string().min(1, 'Position is required').max(100),
  location: z.string().max(100).optional().or(z.literal('')),
  startDate: z.string().max(30).optional().or(z.literal('')),
  endDate: z.string().max(30).optional().or(z.literal('')),
  current: z.boolean().default(false),
  description: z.string().max(1000).optional().or(z.literal('')),
})

export const projectItemSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  technologies: z.array(z.string().max(50)).max(20).default([]),
  github_url: z.string().url().optional().or(z.literal('')),
  live_url: z.string().url().optional().or(z.literal('')),
})

export const skillItemSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(50),
  category: z.enum(['language', 'framework', 'tool', 'soft']),
})

export const achievementItemSchema = z.object({
  title: z.string().min(1, 'Achievement title is required').max(100),
  issuer: z.string().max(100).optional().or(z.literal('')),
  date: z.string().max(30).optional().or(z.literal('')),
  description: z.string().max(300).optional().or(z.literal('')),
})

export const socialLinksSchema = z.object({
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
})

export const themeConfigSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  fontFamily: z.enum(['Inter', 'Roboto', 'Outfit']),
})

export const portfolioDataSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100),
  tagline: z.string().max(150).optional().or(z.literal('')),
  bio: z.string().max(1000).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  education: z.array(educationItemSchema).default([]),
  experience: z.array(experienceItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  skills: z.array(skillItemSchema).default([]),
  achievements: z.array(achievementItemSchema).default([]),
  links: socialLinksSchema.optional(),
  resume_url: z.string().optional().or(z.literal('')),
  template_id: z.string().default('minimal'),
  theme: themeConfigSchema.default({ primaryColor: '#8b5cf6', fontFamily: 'Inter' }),
})

export type PortfolioData = z.infer<typeof portfolioDataSchema>
export type EducationItem = z.infer<typeof educationItemSchema>
export type ExperienceItem = z.infer<typeof experienceItemSchema>
export type ProjectItem = z.infer<typeof projectItemSchema>
export type SkillItem = z.infer<typeof skillItemSchema>
export type AchievementItem = z.infer<typeof achievementItemSchema>
export type SocialLinks = z.infer<typeof socialLinksSchema>
export type ThemeConfig = z.infer<typeof themeConfigSchema>
