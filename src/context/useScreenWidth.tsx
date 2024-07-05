import { useState, useEffect } from 'react'

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty dependency array means this effect runs only on mount and unmount

  return width
}

export default useWindowWidth
