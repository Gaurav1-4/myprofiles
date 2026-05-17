'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, FileText, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { extractTextFromPDF } from '@/lib/utils/pdf-extractor'

interface ResumeStepProps {
  onNext: (data: any) => void
  onSkip: () => void
}

export function ResumeStep({ onNext, onSkip }: ResumeStepProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setFile(selectedFile)
    setIsUploading(true)

    try {
      // 1. Read PDF as base64 to send raw document to Gemini for flawless native multimodal extraction
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1] || '') // Strip data URL prefix
        }
        reader.onerror = reject
        reader.readAsDataURL(selectedFile)
      })
      const pdfBase64 = await base64Promise
      
      // 2. Send to AI API
      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64 }),
      })

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          const textBody = await response.text();
          console.error('Server returned non-JSON error:', textBody.substring(0, 200));
          throw new Error(`Server error (${response.status}): ${textBody.substring(0, 100)}`);
        }
        throw new Error(errorData.error || 'Failed to parse resume');
      }

      let extractedData;
      try {
        extractedData = await response.json();
      } catch (e) {
        const textBody = await response.text();
        console.error('Server returned non-JSON success response:', textBody.substring(0, 200));
        throw new Error('Server returned invalid JSON response');
      }
      toast.success('Resume parsed successfully!')
      onNext(extractedData)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">Zero Effort Setup</h2>
        <p className="text-zinc-500 text-sm font-medium tracking-wide">
          Upload your resume and our <span className="text-white">AI Engine</span> will build your base profile in seconds.
        </p>
      </div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group mt-8 border-2 border-dashed rounded-[2.5rem] p-16 transition-all cursor-pointer flex flex-col items-center justify-center gap-6 ${
          isUploading ? 'border-purple-500/50 bg-purple-500/5' : 'border-zinc-800 hover:border-blue-500/50 hover:bg-white/[0.02]'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf"
          onChange={handleUpload}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
            <div className="space-y-1">
              <p className="font-black text-xs uppercase tracking-[0.3em] text-white">AI Engine Running</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Structuring your experience...</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
              <Upload className="h-8 w-8 text-zinc-400 group-hover:text-blue-400" />
            </div>
            <div className="space-y-2">
              <p className="font-black text-xs uppercase tracking-[0.3em] text-white">Drop Resume PDF</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600">Max file size 5MB</p>
            </div>
          </div>
        )}

        {/* Decorative Sparkles */}
        {!isUploading && (
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-blue-500/40 transition-colors">
            <Sparkles className="w-8 h-8" />
          </div>
        )}
      </motion.div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={onSkip}
          disabled={isUploading}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors"
        >
          I&apos;d rather type everything manually
        </button>
      </div>
    </div>
  )
}
