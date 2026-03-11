import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NotionSection from '@/components/PM/NotionSection'
import GanttChart from '@/components/PM/Gantt/GanttChart'
import AIChatWidget from '@/components/PM/AIChatWidget'
import ChatBtn from '@/assets/chat_btn.svg?react'
import { getNotionStatus } from '@/api/notion'
import useApi from '@/hook/useApi'

interface NotionStatus {
  connected: boolean
  workspaceId: string | null
  workspaceName: string | null
  databaseId: string | null
  databaseSelected: boolean
}

export default function PmPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { teamId } = useParams()
  const { execute } = useApi(getNotionStatus)

  const [notionStatus, setNotionStatus] = useState<NotionStatus>({
    connected: false,
    workspaceId: null,
    workspaceName: null,
    databaseId: null,
    databaseSelected: false,
  })
  const [loading, setLoading] = useState(true)

  const isReady = notionStatus.connected && notionStatus.databaseSelected

  useEffect(() => {
    if (!teamId) return

    const fetchStatus = async () => {
      setLoading(true)
      try {
        const result = await execute(Number(teamId))
        setNotionStatus(result)
      } catch (error) {
        console.error('Failed to load Notion status.', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [teamId, execute])

  const handleUpdated = async () => {
    if (!teamId) return
    setLoading(true)
    try {
      const result = await execute(Number(teamId))
      setNotionStatus(result)
    } catch (error) {
      console.error('Failed to reload Notion status.', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='pt-30 px-30'>
      {loading ? null : isReady ? (
        <GanttChart />
      ) : (
        <div className='mt-30 mx-10'>
          <NotionSection
            connected={notionStatus.connected}
            databaseSelected={notionStatus.databaseSelected}
            onUpdated={handleUpdated}
          />
        </div>
      )}

      <ChatBtn
        className='cursor-pointer fixed bottom-10 right-10 w-16 h-16 hover:scale-105 transition-transform z-50'
        onClick={() => setIsChatOpen(true)}
      />
      <AIChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
