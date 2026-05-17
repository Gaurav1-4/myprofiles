'use client'

export async function extractTextFromPDF(file: File): Promise<string> {
  // Ensure we only run in the browser
  if (typeof window === 'undefined') return ''

  // Dynamically import pdfjs only when needed in the browser
  const pdfjs = await import('pdfjs-dist')
  
  // Set worker source to our local public directory
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    
    // Reconstruct text with proper line breaks based on Y-position changes
    // This preserves the resume's structure (sections, bullet points, etc.)
    let lastY = -1
    let lineText = ''
    
    for (const item of textContent.items) {
      const typedItem = item as any
      if (!typedItem.str) continue
      
      const currentY = typedItem.transform?.[5] ?? -1
      
      // If the Y position changed significantly, it's a new line
      if (lastY !== -1 && Math.abs(currentY - lastY) > 2) {
        fullText += lineText.trim() + '\n'
        lineText = ''
      }
      
      // Add space between items on the same line if needed
      if (lineText.length > 0 && !lineText.endsWith(' ') && !typedItem.str.startsWith(' ')) {
        lineText += ' '
      }
      lineText += typedItem.str
      lastY = currentY
    }
    
    // Don't forget the last line
    if (lineText.trim()) {
      fullText += lineText.trim() + '\n'
    }
    
    fullText += '\n' // Page break
  }

  return fullText.trim()
}
