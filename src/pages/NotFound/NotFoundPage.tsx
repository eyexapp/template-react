import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-6xl font-bold text-gray-300 dark:text-gray-700">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
        {t('notFound.title')}
      </h2>
      <p className="mb-8 text-gray-500 dark:text-gray-400">{t('notFound.description')}</p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-white transition-colors hover:bg-blue-700"
      >
        {t('notFound.goHome')}
      </Link>
    </div>
  )
}
