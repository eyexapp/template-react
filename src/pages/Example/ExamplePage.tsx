import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const exampleSchema = z.object({
  title: z.string().min(3, 'example.titleMin'),
  description: z.string().min(1, 'example.descriptionRequired'),
})

type ExampleFormValues = z.infer<typeof exampleSchema>

export default function ExamplePage() {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
    defaultValues: { title: '', description: '' },
  })

  const onSubmit = async (data: ExampleFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(`Created: ${data.title}`)
    reset()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        {t('example.title')}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('example.formTitle')}
        </h2>

        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('example.titleField')}
          </label>
          <input
            id="title"
            {...register('title')}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder={t('example.titleField')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{t(errors.title.message ?? '')}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('example.descriptionField')}
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder={t('example.descriptionField')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{t(errors.description.message ?? '')}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? t('common.loading') : t('common.submit')}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t('common.reset')}
          </button>
        </div>
      </form>
    </div>
  )
}
