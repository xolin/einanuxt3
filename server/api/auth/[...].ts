import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Simple validation for demo purposes
        // In production, validate against your database
        if (credentials?.email === 'user@example.com' && credentials?.password === 'password') {
          return { 
            id: '1', 
            email: 'user@example.com',
            name: 'Demo User'
          }
        }
        return null
      }
    })
  ]
})