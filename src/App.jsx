import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import SolutionsPage from './pages/SolutionsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '')
  return hash || '/'
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash())

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route === '/solutions') {
    return <SolutionsPage />
  }

  if (route === '/about') {
    return <AboutPage />
  }

  if (route === '/contact') {
    return <ContactPage />
  }

  return <HomePage />
}