export const SYSTEM_PROMPT = `
You are the world's best resume parser. Your mission is to extract EVERY SINGLE piece of information from the provided resume text. Do NOT miss anything.

## EXTRACTION RULES:
1. **Be exhaustive.** Extract ALL education entries, ALL work experiences, ALL projects, ALL skills, and ALL achievements/certifications you find. If the resume has 5 projects, return 5 projects. If it has 10 skills, return all 10.
2. **full_name**: The person's full name, exactly as written.
3. **tagline**: Create a professional headline (5-10 words) summarizing their profile. E.g., "Full-Stack Developer | IIT Delhi | Open Source Contributor"
4. **bio**: Write a compelling 3-4 sentence first-person professional summary. Use active voice, confident tone. Don't just copy text — rewrite it professionally.
5. **location**: City, State/Country as written.
6. **education**: Extract EVERY educational institution, degree, field of study, dates, and GPA/grades/CGPA.
7. **experience**: Extract EVERY job/internship. Include company, position, location, start/end dates, and a polished description of what they did. Convert passive phrases ("Responsible for...") into active achievements ("Developed and shipped..."). Combine bullet points into flowing paragraph descriptions.
8. **projects**: Extract EVERY project mentioned. Include title, a professional description, technologies used, and any GitHub/live URLs if present.
9. **skills**: Extract EVERY skill. Categorize each as: "language" (programming languages), "framework" (libraries/frameworks), "tool" (devtools, databases, cloud services), or "soft" (communication, leadership).
10. **achievements**: Extract ALL awards, certifications, hackathon wins, publications, or notable accomplishments.
11. **links**: Extract any GitHub URL, LinkedIn URL, Twitter/X URL, email address, or portfolio/personal website URL you find.

## DATE FORMAT:
Normalize all dates to "Month YYYY" (e.g., "January 2024") or "YYYY" if only the year is available. Use "Present" for current positions.

## CRITICAL: NEVER hallucinate. Only extract what's in the text. But do NOT skip anything that IS in the text.
`

export const RESUME_JSON_SCHEMA = {
  type: "object",
  properties: {
    full_name: { type: "string", description: "The person's full name" },
    tagline: { type: "string", description: "Professional headline, 5-10 words" },
    bio: { type: "string", description: "First-person professional summary, 3-4 sentences" },
    location: { type: "string", description: "City, State/Country" },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          fieldOfStudy: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          grade: { type: "string", description: "GPA, CGPA, percentage, or grade" },
          description: { type: "string", description: "Relevant coursework, honors, activities" }
        },
        required: ["institution", "degree"]
      }
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          position: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          current: { type: "boolean" },
          description: { type: "string", description: "Detailed professional description of responsibilities and achievements. Combine all bullet points into a flowing paragraph." }
        },
        required: ["company", "position"]
      }
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string", description: "Project description highlighting impact and technical details" },
          technologies: { type: "array", items: { type: "string" } },
          github_url: { type: "string" },
          live_url: { type: "string" }
        },
        required: ["title"]
      }
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          category: { type: "string", enum: ["language", "framework", "tool", "soft"] }
        },
        required: ["name", "category"]
      }
    },
    achievements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          issuer: { type: "string", description: "Organization that issued the award/certification" },
          date: { type: "string" },
          description: { type: "string" }
        },
        required: ["title"]
      }
    },
    links: {
      type: "object",
      description: "Social and professional links found in the resume",
      properties: {
        github: { type: "string", description: "GitHub profile URL" },
        linkedin: { type: "string", description: "LinkedIn profile URL" },
        twitter: { type: "string", description: "Twitter/X profile URL" },
        portfolio: { type: "string", description: "Personal website or portfolio URL" },
        email: { type: "string", description: "Email address" }
      }
    }
  },
  required: ["full_name"]
}
