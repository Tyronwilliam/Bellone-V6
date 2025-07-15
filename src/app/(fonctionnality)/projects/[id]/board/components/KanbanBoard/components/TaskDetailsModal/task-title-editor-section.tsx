'use client'

import type React from 'react'

import { useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface TaskTitleEditorProps {
  title: string
  onTitleChange: (title: string) => void
  placeholder?: string
}

export function TaskTitleEditor({
  title,
  onTitleChange,
  placeholder = 'Titre de la tâche'
}: TaskTitleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTitleChange(e.target.value)

    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }, [title])

  return (
    <Textarea
      id="title"
      ref={textareaRef}
      value={title}
      onChange={handleChange}
      rows={1}
      className="w-full h-auto resize-none overflow-hidden  !text-2xl font-bold border-none shadow-none pt-4 px-4 focus-visible:ring-0 focus-visible:outline-none leading-tight"
      placeholder={placeholder}
    />
  )
}
