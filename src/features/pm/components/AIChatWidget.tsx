import { useState, useRef, useEffect } from 'react'
import { initChatStream, connectChatStream } from '@/shared/api/chat'
import { useParams } from 'react-router-dom'
import { ChatMessage } from '@/shared/types/chat'
import ChatIcon from '@/assets/ai_chat.svg?react'
import HeaderIcon from '@/assets/ai_header.svg?react'
import SendIcon from '@/assets/ai_send.svg?react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const loadingDotsStyle = `
  @keyframes bounce-dot {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-6px); opacity: 1; }
  }
  .dot-1 { animation: bounce-dot 1.2s infinite ease-in-out; animation-delay: 0s; }
  .dot-2 { animation: bounce-dot 1.2s infinite ease-in-out; animation-delay: 0.2s; }
  .dot-3 { animation: bounce-dot 1.2s infinite ease-in-out; animation-delay: 0.4s; }
`

function LoadingDots() {
  return (
    <>
      <style>{loadingDotsStyle}</style>
      <div className='flex items-center gap-1 h-5 px-1'>
        <span className='dot-1 w-2 h-2 rounded-full bg-[#b76aa9] inline-block' />
        <span className='dot-2 w-2 h-2 rounded-full bg-[#b76aa9] inline-block' />
        <span className='dot-3 w-2 h-2 rounded-full bg-[#b76aa9] inline-block' />
      </div>
    </>
  )
}

const markdownStyles = `
  .ai-markdown p { margin: 0 0 0.5em; line-height: 1.6; }
  .ai-markdown p:last-child { margin-bottom: 0; }
  .ai-markdown h1, .ai-markdown h2, .ai-markdown h3 {
    font-weight: 700; margin: 0.75em 0 0.3em; line-height: 1.3;
  }
  .ai-markdown h1 { font-size: 1.15em; }
  .ai-markdown h2 { font-size: 1.05em; }
  .ai-markdown h3 { font-size: 0.97em; }
  .ai-markdown ul, .ai-markdown ol {
    margin: 0.4em 0; padding-left: 1.3em;
  }
  .ai-markdown li { margin: 0.2em 0; }
  .ai-markdown code {
    background: rgba(183,106,169,0.12);
    color: #8a3d7f;
    border-radius: 4px;
    padding: 0.1em 0.35em;
    font-size: 0.88em;
    font-family: 'Menlo', 'Monaco', monospace;
  }
  .ai-markdown pre {
    background: rgba(183,106,169,0.08);
    border-radius: 10px;
    padding: 0.8em 1em;
    overflow-x: auto;
    margin: 0.5em 0;
  }
  .ai-markdown pre code {
    background: none;
    padding: 0;
    color: #6b3062;
    font-size: 0.85em;
  }
  .ai-markdown strong { font-weight: 700; color: #5a2a52; }
  .ai-markdown em { font-style: italic; }
  .ai-markdown blockquote {
    border-left: 3px solid #cb7cb5;
    margin: 0.4em 0;
    padding: 0.2em 0.8em;
    color: #7a4a72;
    background: rgba(203,124,181,0.07);
    border-radius: 0 6px 6px 0;
  }
  .ai-markdown a { color: #b76aa9; text-decoration: underline; }
  .ai-markdown hr { border: none; border-top: 1px solid rgba(183,106,169,0.25); margin: 0.6em 0; }
  .ai-markdown table { border-collapse: collapse; width: 100%; font-size: 0.9em; margin: 0.4em 0; }
  .ai-markdown th, .ai-markdown td {
    border: 1px solid rgba(183,106,169,0.25);
    padding: 0.3em 0.6em;
  }
  .ai-markdown th { background: rgba(203,124,181,0.1); font-weight: 700; }
`

export default function AIChatWidget({ isOpen, onClose }: Props) {
  const { teamId } = useParams()
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !teamId) return

    const userMessage = inputValue
    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', text: userMessage }])
    setInputValue('')

    try {
      const streamId = await initChatStream(Number(teamId), userMessage)
      const aiMessageId = Date.now() + 1
      setMessages((prev) => [...prev, { id: aiMessageId, type: 'ai', text: '' }])

      await connectChatStream(Number(teamId), streamId, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg)),
        )
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <style>{markdownStyles}</style>
      {isOpen && (
        <div className='fixed bottom-10 right-10 w-90 h-150 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden z-50 border border-gray-100'>
          <div className='bg-linear-to-r from-[#FBEDEC] to-[#F3ADCF] px-5 py-4 flex justify-between items-center'>
            <div className='flex items-center gap-2 font-bold text-gray-900 text-[17px]'>
              <HeaderIcon className='w-9 h-9' />
              AI Assistant
            </div>
            <button
              onClick={onClose}
              className='text-gray-800 hover:text-black transition-colors cursor-pointer'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'></path>
              </svg>
            </button>
          </div>

          <div className='flex-1 p-5 overflow-y-auto flex flex-col gap-5 bg-white'>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start gap-3'}`}
              >
                {msg.type === 'ai' && <ChatIcon className='w-9 h-9 shrink-0' />}

                <div
                  className={`px-5 py-4 min-h-12 text-[15px] leading-relaxed wrap-break-word ${
                    msg.type === 'user'
                      ? 'bg-[#b76aa9] text-white rounded-2xl rounded-br-sm max-w-[80%]'
                      : 'bg-[#faeaee] text-gray-800 rounded-2xl rounded-tl-sm max-w-[75%]'
                  }`}
                >
                  {msg.type === 'ai' ? (
                    msg.text ? (
                      <div className='ai-markdown'>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <LoadingDots />
                    )
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className='p-4 bg-white border-t border-gray-50'>
            <form onSubmit={handleSend} className='relative flex items-center'>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='w-full border border-gray-300 rounded-full pl-5 pr-14 py-3 text-[15px] focus:outline-none focus:border-[#b76aa9] transition-colors placeholder:text-gray-400'
                placeholder='Type your message...'
              />
              <button
                type='submit'
                className='absolute right-2 w-9 h-9 rounded-full bg-[#cb7cb5] hover:bg-[#b76aa9] transition-colors flex items-center justify-center text-white'
              >
                <SendIcon className='cursor-pointer' />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
