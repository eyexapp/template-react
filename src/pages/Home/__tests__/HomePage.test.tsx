import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import HomePage from '@/pages/Home/HomePage'

describe('HomePage', () => {
  it('renders the welcome heading', () => {
    render(<HomePage />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('renders all feature cards', () => {
    render(<HomePage />)
    expect(screen.getByText('Zustand')).toBeInTheDocument()
    expect(screen.getByText('Axios')).toBeInTheDocument()
    expect(screen.getByText('Vitest')).toBeInTheDocument()
  })
})
