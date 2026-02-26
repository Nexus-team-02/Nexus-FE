import { Outlet } from 'react-router-dom'
import Header from '@/components/Layout/Header'
import RouteChangeLoader from '@/components/Layout/RouteChangeLoader'

export default function RootLayout() {
  return (
    <>
      <RouteChangeLoader />
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}
