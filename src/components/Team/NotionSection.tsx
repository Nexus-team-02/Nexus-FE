import Title from '@/components/common/Title'
import NotionIcon from '@/assets/notion.svg?react'

export default function NotionSection() {
  const handleConnect = () => {
    const teamId = 3

    const redirectUri = encodeURIComponent('https://pingpong-team.vercel.app/notion/callback')

    const state = encodeURIComponent(JSON.stringify({ teamId }))

    const notionAuthUrl =
      `https://api.notion.com/v1/oauth/authorize` +
      `?client_id=2f5d872b-594c-80cc-a32b-003748ffcba9` +
      `&response_type=code` +
      `&owner=user` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}`

    window.location.href = notionAuthUrl
  }

  return (
    <section className='rounded-xl border border-black/10 bg-white/60 px-6 py-8'>
      <Title size='md'>NOTION</Title>

      <div className='flex items-center justify-between gap-6'>
        <div className='flex items-center gap-4'>
          <NotionIcon className='w-10 h-10' />
          <p className='text-sm text-gray-600 leading-relaxed'>
            Connect your team workspace to manage documents, meeting notes, and tasks together.
          </p>
        </div>

        <button
          onClick={handleConnect}
          className='shrink-0 cursor-pointer rounded-full border border-black/20 px-6 py-2 text-sm font-medium hover:bg-black hover:text-white transition'
        >
          CONNECT
        </button>
      </div>
    </section>
  )
}
