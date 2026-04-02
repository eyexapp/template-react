export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:px-6 lg:px-8">
        &copy; {new Date().getFullYear()} MyApp. Built with React, TypeScript &amp; Vite.
      </div>
    </footer>
  )
}
