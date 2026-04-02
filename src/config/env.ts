import { z } from 'zod/v4'

const envSchema = z.object({
  VITE_API_BASE_URL: z.url().default('http://localhost:3000/api'),
  VITE_APP_TITLE: z.string().default('MyApp'),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const parsed = envSchema.safeParse(import.meta.env)
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', z.prettifyError(parsed.error))
    throw new Error('Invalid environment variables')
  }
  return parsed.data
}

export const env = validateEnv()
