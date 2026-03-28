import { Member } from '@/shared/types/user'
import Avatar from '@/assets/profile.svg?react'
import { ROLE_CONFIG, getRoleFromApi } from '@/shared/constants/role'

interface Props {
  member: Member
}

export default function MemberCard({ member }: Props) {
  const { name, email, role } = member

  const uiRole = getRoleFromApi(role)
  const config = uiRole ? ROLE_CONFIG[uiRole] : undefined

  return (
    <article className='flex items-center gap-4 rounded-xl border border-black/10 bg-white/60 p-5 shadow-sm transition-colors hover:bg-white/80'>
      {/* 1. 아바타 영역 */}
      <Avatar className='h-12 w-12 shrink-0 rounded-full' />

      {/* 2. 유저 정보 영역 */}
      <div className='flex flex-col flex-1'>
        <div className='mb-1 flex items-center gap-2'>
          {/* 시맨틱 태그 사용 */}
          <h3 className='text-lg font-semibold text-gray-900 leading-tight'>{name}</h3>

          {/* 뱃지 스타일링 정돈 및 Fallback 스타일 추가 */}
          <span
            className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-medium leading-none
              ${config?.badge ?? 'bg-gray-100 text-gray-600'}`}
          >
            {config?.label ?? role}
          </span>
        </div>

        <p className='text-xs font-normal text-gray-500'>{email}</p>
      </div>
    </article>
  )
}
