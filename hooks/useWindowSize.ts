import { useEffect, useState } from 'react'

interface UseWindowSizeReturn {
  height: number
  width: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

function useWindowSize(): UseWindowSizeReturn {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth < 1024)
      setIsDesktop(window.innerWidth > 1024)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)

      handleResize()

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    height: windowSize.height,
    width: windowSize.width,
    isMobile,
    isTablet,
    isDesktop,
  }
}

export default useWindowSize
