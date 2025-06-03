'use client'

import { useSensor, useSensors, MouseSensor } from '@dnd-kit/core'

export function useKanbanSensors() {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  return sensors
}
