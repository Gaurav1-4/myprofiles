import { MinimalTemplate } from '../MinimalTemplate'
import { DeveloperTemplate } from '../DeveloperTemplate'
import { CreativeTemplate } from '../CreativeTemplate'

export const TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, focused, and professional. Perfect for any industry.',
    preview: '/templates/minimal.png'
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Monospace aesthetic inspired by terminal environments.',
    preview: '/templates/developer.png'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant, bold, and asymmetric for designers.',
    preview: '/templates/creative.png'
  }
]

export function getTemplateComponent(id: string) {
  switch (id) {
    case 'creative':
      return CreativeTemplate
    case 'developer':
      return DeveloperTemplate
    case 'minimal':
    default:
      return MinimalTemplate
  }
}
