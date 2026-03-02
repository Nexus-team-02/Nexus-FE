import { useState } from 'react'
import Open from '@/assets/up.svg?react'
import { getDetailsEndpoint } from '@/api/swagger'
import useApi from '@/hook/useApi'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

const METHOD_STYLE: Record<
  HttpMethod,
  { bg: string; border: string; text: string; badge: string }
> = {
  GET: {
    bg: 'bg-api-blue-sub',
    border: 'border-api-blue',
    text: 'text-api-blue',
    badge: 'bg-api-blue',
  },
  POST: {
    bg: 'bg-api-green-sub',
    border: 'border-api-green',
    text: 'text-api-green',
    badge: 'bg-api-green',
  },
  PUT: {
    bg: 'bg-api-yellow-sub',
    border: 'border-api-yellow',
    text: 'text-api-yellow',
    badge: 'bg-api-yellow',
  },
  DELETE: {
    bg: 'bg-api-red-sub',
    border: 'border-api-red',
    text: 'text-api-red',
    badge: 'bg-api-red',
  },
  PATCH: {
    bg: 'bg-[#EFF8F5]',
    border: 'border-[#8BE0C4]',
    text: 'text-[#8BE0C4]',
    badge: 'bg-[#8BE0C4]',
  },
}

interface Props {
  method: HttpMethod
  path: string
  summary?: string
  endpointId: number
}

function Section({
  title,
  children,
  method,
  rightElement,
}: {
  title: string
  children: React.ReactNode
  method: HttpMethod
  rightElement?: React.ReactNode
}) {
  return (
    <div className='overflow-hidden rounded bg-white shadow-sm'>
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${METHOD_STYLE[method].border} bg-gray-50/50`}
      >
        <h4 className='text-sm font-semibold text-gray-800'>{title}</h4>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div className='px-4 py-4'>{children}</div>
    </div>
  )
}

export default function ApiAccordionItem({ method, path, summary, endpointId }: Props) {
  const { execute, data, loading } = useApi(getDetailsEndpoint)

  const [open, setOpen] = useState(false)
  const [isTryItOut, setIsTryItOut] = useState(false)

  const handleToggle = async () => {
    const next = !open
    setOpen(next)

    if (next && !data) {
      await execute(endpointId)
    }

    if (!next) {
      setIsTryItOut(false)
    }
  }

  return (
    <div className={`overflow-hidden rounded-md border ${METHOD_STYLE[method].border}`}>
      <button
        onClick={handleToggle}
        className={`flex w-full cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:brightness-95 ${METHOD_STYLE[method].bg}`}
      >
        <span
          className={`min-w-16 rounded px-3 py-1.5 pt-1.75 text-center text-xs font-bold text-white ${METHOD_STYLE[method].badge}`}
        >
          {method}
        </span>

        <span className='text-sm font-medium text-gray-900'>{path}</span>
        {summary && <span className='text-xs text-gray-600 mt-1'>{summary}</span>}

        <span className={`ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <Open className={`${METHOD_STYLE[method].text} h-5 w-5`} />
        </span>
      </button>

      {open && (
        <div
          className={`space-y-4 border-t px-4 py-6 ${METHOD_STYLE[method].border} ${METHOD_STYLE[method].bg}`}
        >
          {loading && (
            <div className='animate-pulse p-4 text-sm font-medium text-gray-500'>
              Loading parameters and responses...
            </div>
          )}

          {data && (
            <>
              {data.parameters?.length > 0 && data.parameters[0].description && (
                <p className='text-sm text-gray-700'>{data.parameters[0].description}</p>
              )}

              <Section
                title='Parameters'
                method={method}
                rightElement={
                  <button
                    onClick={() => setIsTryItOut(!isTryItOut)}
                    className='cursor-pointer rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100'
                  >
                    {isTryItOut ? 'Cancel' : 'Try it out'}
                  </button>
                }
              >
                {!data.parameters || data.parameters.length === 0 ? (
                  <div className='py-4 text-center text-sm italic text-gray-500'>No parameters</div>
                ) : (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-4 gap-4 border-b pb-2 text-xs font-semibold text-gray-500'>
                      <div className='col-span-1'>Name</div>
                      <div className='col-span-3'>Description</div>
                    </div>

                    <div className='space-y-4'>
                      {data.parameters.map((p) => (
                        <div key={p.name} className='grid grid-cols-4 gap-4 text-sm'>
                          <div className='col-span-1 wrap-break-word'>
                            <div className='font-semibold text-gray-900'>
                              {p.name}
                              {p.required && <span className='ml-1 text-red-500'>*</span>}
                            </div>
                            <div className='mt-1 text-xs text-gray-500'>{p.type}</div>
                            <div className='text-xs italic text-gray-400'>({p.in})</div>
                          </div>
                          <div className='col-span-3 text-gray-700'>
                            {isTryItOut ? (
                              <div className='mt-2'>
                                <input
                                  type='text'
                                  placeholder={p.name}
                                  className='w-50 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                                />
                              </div>
                            ) : (
                              p.description || <span className='text-gray-400'>-</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isTryItOut && (
                  <div className='mt-6 border-t pt-4'>
                    <button className='w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto'>
                      Execute
                    </button>
                  </div>
                )}
              </Section>

              {data.requests?.length > 0 && (
                <Section title='Request Body' method={method}>
                  <div className='space-y-4'>
                    {data.requests.map((r, i) => (
                      <div key={i} className='space-y-2'>
                        <div className='text-sm font-medium text-gray-700'>
                          {r.mediaType}
                          {r.required && (
                            <span className='ml-2 text-xs text-red-500'>* required</span>
                          )}
                        </div>
                        <pre className='max-h-64 overflow-auto rounded-md bg-[#1e293b] p-4 text-xs leading-relaxed text-slate-50'>
                          <code>{JSON.stringify(r.schema, null, 2)}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {data.responses?.length > 0 && (
                <Section title='Responses' method={method}>
                  <div className='space-y-6'>
                    {data.responses.map((res) => (
                      <div key={res.statusCode} className='space-y-2'>
                        <div className='flex items-center gap-3'>
                          <span className='font-bold text-gray-900'>{res.statusCode}</span>
                          <span className='text-sm text-gray-600'>{res.description}</span>
                        </div>
                        <div className='text-xs text-gray-500'>
                          Media type:{' '}
                          <span className='font-medium text-gray-700'>{res.mediaType}</span>
                        </div>
                        {res.schema && (
                          <pre className='max-h-64 overflow-auto rounded-md bg-[#1e293b] p-4 text-xs leading-relaxed text-slate-50'>
                            <code>{JSON.stringify(res.schema, null, 2)}</code>
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {data.security?.length > 0 && (
                <Section title='Security' method={method}>
                  <div className='space-y-3'>
                    {data.security.map((s, i) => (
                      <div key={i} className='flex flex-col gap-1 rounded bg-gray-50 p-3 text-sm'>
                        <div>
                          <span className='font-semibold text-gray-700'>Type:</span> {s.type}
                        </div>
                        <div>
                          <span className='font-semibold text-gray-700'>Scheme:</span> {s.scheme}
                        </div>
                        {s.headerName && (
                          <div>
                            <span className='font-semibold text-gray-700'>Header:</span>{' '}
                            {s.headerName}
                          </div>
                        )}
                        {s.bearerFormat && (
                          <div>
                            <span className='font-semibold text-gray-700'>Format:</span>{' '}
                            {s.bearerFormat}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
