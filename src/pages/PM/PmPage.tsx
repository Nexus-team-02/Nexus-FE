import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NotionSection from '@/components/Team/NotionSection'
import GanttChart from '@/components/PM/Gantt/GanttChart'
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
  const { teamId } = useParams()
  const { execute } = useApi(getNotionStatus)

  const [notionStatus, setNotionStatus] = useState<NotionStatus>({
    connected: false,
    workspaceId: null,
    workspaceName: null,
    databaseId: null,
    databaseSelected: false,
  })

  const isReady = notionStatus.connected && notionStatus.databaseSelected

  useEffect(() => {
    if (!teamId) return

    const fetchStatus = async () => {
      try {
        const result = await execute(Number(teamId))
        setNotionStatus(result)
      } catch (error) {
        console.error('Failed to load Notion status.', error)
      }
    }

    fetchStatus()
  }, [teamId, execute])

  const handleUpdated = async () => {
    if (!teamId) return

    try {
      const result = await execute(Number(teamId))
      setNotionStatus(result)
    } catch (error) {
      console.error('Failed to reload Notion status.', error)
    }
  }

  return (
    <div className='pt-60 px-40'>
      {isReady ? (
        <GanttChart />
      ) : (
        <NotionSection
          connected={notionStatus.connected}
          databaseSelected={notionStatus.databaseSelected}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  )
}
