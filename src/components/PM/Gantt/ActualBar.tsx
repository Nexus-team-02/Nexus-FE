import { getDayOffset, getToday } from '@/utils/date'
import { DateRange } from '@/types/gantt'

export default function ActualBar({ date, DAY_WIDTH }: { date: DateRange; DAY_WIDTH: number }) {
  const today = getToday()

  const startOffset = getDayOffset(date.start)
  const endOffset = getDayOffset(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate(),
    ).padStart(2, '0')}`,
  )

  const duration = endOffset - startOffset
  if (duration <= 0) return null

  return (
    <div
      className='absolute h-8 rounded-sm bg-linear-to-r from-pink-300 to-fuchsia-400 shadow-sm z-10 pointer-events-none'
      style={{
        left: startOffset * DAY_WIDTH,
        width: duration * DAY_WIDTH,
      }}
    />
  )
}
