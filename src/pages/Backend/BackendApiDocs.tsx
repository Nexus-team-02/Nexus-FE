import ApiAccordionItem from '@/components/api/ApiAccordionItem'
import useApi from '@/hook/useApi'
import { getAllEndpoints } from '@/api/swagger'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Title from '@/components/common/Title'
import Lock from '@/assets/lock.svg?react'
import AuthorizeModal from '@/components/api/AuthorizeModal'

export default function BackendApiDocsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { execute, loading, data } = useApi(getAllEndpoints)
  const { teamId } = useParams()

  useEffect(() => {
    if (teamId) execute(Number(teamId))
  }, [teamId, execute])

  const { created, modified, deleted } = useMemo(() => {
    const result = {
      created: [] as typeof data,
      modified: [] as typeof data,
      deleted: [] as typeof data,
    }

    data?.forEach((endpoint) => {
      if (endpoint.changeType === 'CREATED') result.created?.push(endpoint)
      if (endpoint.changeType === 'MODIFIED') result.modified?.push(endpoint)
      if (endpoint.changeType === 'DELETED') result.deleted?.push(endpoint)
    })

    return result
  }, [data])

  return (
    <div className='min-h-screen p-20 z-20'>
      <div className='w-full rounded-xl bg-white mx-auto p-8 mt-35'>
        <h1 className='font-extrabold text-lg pb-10'>NEW CHANGES</h1>
        {loading && <div className='mb-4'>Loading...</div>}

        <Title>ADD</Title>
        <div className='flex flex-col gap-4 mb-8'>
          {created?.map((endpoint) => (
            <ApiAccordionItem
              key={endpoint.endpointId}
              method={endpoint.method}
              path={endpoint.path}
              summary={endpoint.summary}
              endpointId={endpoint.endpointId}
            />
          ))}
        </div>

        <Title>UPDATE</Title>
        <div className='flex flex-col gap-4 mb-8'>
          {modified?.map((endpoint) => (
            <ApiAccordionItem
              key={endpoint.endpointId}
              method={endpoint.method}
              path={endpoint.path}
              summary={endpoint.summary}
              endpointId={endpoint.endpointId}
            />
          ))}
        </div>

        <Title>DELETE</Title>
        <div className='flex flex-col gap-4 mb-8'>
          {deleted?.map((endpoint) => (
            <ApiAccordionItem
              key={endpoint.endpointId}
              method={endpoint.method}
              path={endpoint.path}
              summary={endpoint.summary}
              endpointId={endpoint.endpointId}
            />
          ))}
        </div>

        <Title
          right={
            <button
              onClick={() => setIsModalOpen(true)}
              className='flex items-center gap-1 rounded-md border border-black px-2 py-1 text-sm font-medium text-black hover:bg-gray-100/50 cursor-pointer'
            >
              Authorise
              <Lock className='w-4.5 h-4.5' />
            </button>
          }
        >
          ALL
        </Title>
        <div className='flex flex-col gap-4'>
          {data?.map((endpoint) => (
            <ApiAccordionItem
              key={endpoint.endpointId}
              method={endpoint.method}
              path={endpoint.path}
              summary={endpoint.summary}
              endpointId={endpoint.endpointId}
            />
          ))}
        </div>
      </div>
      {isModalOpen && (
        <AuthorizeModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={(token) => {
            localStorage.setItem('accessToken', token)
          }}
        />
      )}
    </div>
  )
}
