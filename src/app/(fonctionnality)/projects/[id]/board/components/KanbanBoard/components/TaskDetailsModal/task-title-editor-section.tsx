'use client'

import type React from 'react'

import { useRef, useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { useDebouncedCallback } from 'use-debounce'

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
  const [localTitle, setLocalTitle] = useState(title)

  const debouncedUpdate = useDebouncedCallback((value: string) => {
    onTitleChange(value)
  }, 500)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setLocalTitle(value)
    debouncedUpdate(value)

    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    setLocalTitle(title)
  }, [title])

  return (
    <Textarea
      id="title"
      ref={textareaRef}
      value={localTitle}
      onChange={handleChange}
      rows={1}
      className="w-[95%] h-auto resize-none overflow-hidden  !text-2xl font-bold border-none shadow-none pt-4 px-4 focus-visible:ring-0 focus-visible:outline-none leading-tight"
      placeholder={placeholder}
    />
  )
}
