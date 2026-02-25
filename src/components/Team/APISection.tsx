import { useNavigate, useLocation } from 'react-router-dom'
import { ROLE_CONFIG, getRoleFromApi } from '@/constants/role'
import Title from '../common/Title'
import Plus from '@/assets/plus.svg?react'

interface Props {
  role?: string
}

export default function APISection({ role }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = () => {
    if (!role) return

    const internalRole = getRoleFromApi(role)
    if (!internalRole) return

    const subPath = ROLE_CONFIG[internalRole].route
    navigate(`${location.pathname}/${subPath}`)
  }

  return (
    <section>
      <Title size='lg' right={<Plus className='w-7 h-7 cursor-pointer' onClick={handleClick} />}>
        API
      </Title>
    </section>
  )
}
