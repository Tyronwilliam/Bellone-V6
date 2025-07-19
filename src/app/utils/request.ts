import { TaskWithAssigneeAndTags } from '@/infrastructure/board/boardInterface'

export function cleanFalsyFields<T extends object>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined && value !== '')
  ) as Partial<T>
}

