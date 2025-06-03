"use client"

interface BoardHeaderProps {
  projectName: string
}

export function BoardHeader({ projectName }: BoardHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{projectName}</h1>
    </div>
  )
}
