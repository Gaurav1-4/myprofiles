import { z } from 'zod'

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
})

export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url().optional().or(z.literal('')),
  technologies: z.array(z.string()).default([]),
})

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  category: z.string().optional(),
})

export const linkSchema = z.object({
  platform: z.string(),
  url: z.string().url(),
})

export const portfolioDataSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  tagline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  education: z.array(educationSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(skillSchema).default([]),
  achievements: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
})

export type PortfolioData = z.infer<typeof portfolioDataSchema>
