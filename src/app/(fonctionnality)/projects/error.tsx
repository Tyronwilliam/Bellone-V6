// app/projects/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Erreur dans la page Projects :', error)
  }, [error])

  return (
    <div className="text-red-600 p-4">
      <h2>Une erreur est survenue.</h2>
      <button onClick={() => reset()} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
        Réessayer
      </button>
    </div>
  )
}
