import ProfileSection from '@/components/My/ProfileSection'
import MyTeamSection from '@/components/My/MyTeamSection'

export default function MyPage() {
  return (
    <div className='w-full pt-20'>
      <ProfileSection />
      <MyTeamSection />
    </div>
  )
}
