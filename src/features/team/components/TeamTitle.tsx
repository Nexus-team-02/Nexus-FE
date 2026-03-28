import { useState, useEffect } from 'react'
import EditIcon from '@/assets/edit.svg?react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function TeamTitle({ value, onChange }: Props) {
  const [editing, setEditing] = useState(!value)
  const [tempName, setTempName] = useState(value)

  useEffect(() => {
    setTempName(value)
  }, [value])

  const save = () => {
    const finalName = tempName.trim()
    onChange(finalName)
    setEditing(false)
  }

  const cancel = () => {
    setTempName(value)
    setEditing(false)
  }

  return (
    <div className='flex flex-col items-center gap-3'>
      {!editing && !value && (
        <p className='text-xs text-red-400 font-medium'>⚠ 팀 이름을 입력해주세요</p>
      )}
      <div className='flex items-center justify-center gap-3'>
        {editing ? (
          <div className='relative'>
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save()
                if (e.key === 'Escape') cancel()
              }}
              autoFocus
              className='
              text-3xl font-bold text-center
              px-4 py-2 rounded-2xl
              border border-black/20
              focus:border-black/40
              focus:ring-2 focus:ring-black/10
              outline-none
              transition
            '
            />

            <span className='absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-black/40'>
              Enter to save · Esc to cancel
            </span>
          </div>
        ) : (
          <>
            <h1 className='text-3xl font-bold py-2.25'>{value || 'TEAM NAME'}</h1>

            <button
              onClick={() => {
                setTempName(value)
                setEditing(true)
              }}
              className='
              p-1.5 rounded-md
              hover:bg-black/5
              transition
            '
              aria-label='Edit team name'
            >
              <EditIcon className='w-5 h-5 text-black/40' />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
