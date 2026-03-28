interface ChatButtonProps {
  onClick: () => void
}

export default function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label='Open AI chat'
      className='
        fixed bottom-10 right-10 z-50
        w-16 h-16 rounded-full
        bg-linear-to-br from-pink-400 to-fuchsia-500
        shadow-lg shadow-pink-300/50
        flex items-center justify-center
        hover:scale-110 hover:shadow-xl hover:shadow-pink-300/60
        active:scale-95
        transition-all duration-200 ease-out
        group cursor-pointer
      '
    >
      <span className='absolute inset-0 rounded-full bg-pink-400 opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-300 pointer-events-none' />

      <svg
        width='28'
        height='28'
        viewBox='0 0 28 28'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='relative z-10 drop-shadow-sm'
      >
        <path
          d='M4 6C4 4.34315 5.34315 3 7 3H21C22.6569 3 24 4.34315 24 6V17C24 18.6569 22.6569 20 21 20H15.5L10.5 24.5C10.1 24.85 9.5 24.57 9.5 24.04V20H7C5.34315 20 4 18.6569 4 17V6Z'
          fill='white'
          fillOpacity='0.95'
        />
        <circle cx='10' cy='11.5' r='1.5' fill='#f472b6' />
        <circle cx='14' cy='11.5' r='1.5' fill='#ec4899' />
        <circle cx='18' cy='11.5' r='1.5' fill='#f472b6' />
      </svg>
    </button>
  )
}
