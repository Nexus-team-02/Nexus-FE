import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <main className='relative min-h-screen overflow-hidden'>
      <div className='pointer-events-none fixed inset-0 -z-10'>
        <div className='absolute inset-0 bg-dot-layout' />
      </div>

      <div className='relative z-10'>
        <Outlet />
      </div>
    </main>
  )
}
