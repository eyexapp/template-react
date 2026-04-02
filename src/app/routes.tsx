import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { PageLayout } from '@/components/layout'

const HomePage = lazy(() => import('@/pages/Home'))
const ExamplePage = lazy(() => import('@/pages/Example'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

export const routes: RouteObject[] = [
  {
    element: <PageLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'example', element: <ExamplePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
