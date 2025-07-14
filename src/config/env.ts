import * as z from 'zod';
import 'dotenv/config';

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .default('false'),
    APP_URL: z.string().optional().default('https://localhost:7243'),
    APP_MOCK_API_PORT: z.string().optional().default('8080'),
    SESSION_SECRET_KEY: z
      .string()
      .optional()
      .default('jiaowjefioawejfeeejfiwoaejfiaowjefoiawjefioawjeofi'),
  });

  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    console.error(
      'Environment validation failed:',
      parsedEnv.error.flatten().fieldErrors,
    );
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
  
  Please check your .env file and ensure all required variables are set.
  For SESSION_SECRET_KEY, you can generate a secure key using: openssl rand -base64 32
  `,
    );
  }

  return parsedEnv.data ?? {};
};

export const env = createEnv();
