import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
        {t('home.title')}
      </h1>
      <p className="max-w-lg text-lg text-gray-600 dark:text-gray-400">
        {t('home.subtitle')}
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Zustand', desc: 'Lightweight state management' },
          { title: 'React Router v7', desc: 'Declarative routing with lazy loading' },
          { title: 'Axios', desc: 'HTTP client with interceptors' },
          { title: 'Zod', desc: 'TypeScript-first schema validation' },
          { title: 'i18next', desc: 'Internationalization support' },
          { title: 'Vitest', desc: 'Vite-native test runner' },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
          >
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
