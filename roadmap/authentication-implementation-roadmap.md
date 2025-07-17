# Authentication Implementation Roadmap

## Overview
This document outlines the available authentication options for the Nuxt 3 project after removing `nuxt-sanctum-auth`. Each option is documented with implementation steps, pros/cons, and specific configuration requirements.

---

## Option 1: @sidebase/nuxt-auth (Recommended)
**Modern, actively maintained auth solution for Nuxt 3**

### Installation Steps
```bash
pnpm add @sidebase/nuxt-auth
```

### Configuration
1. Add to `nuxt.config.ts`:
```typescript
modules: ['nuxt-gtag', '@sidebase/nuxt-auth']

auth: {
  baseURL: process.env.AUTH_ORIGIN,
  provider: {
    type: 'authjs'
  }
}
```

2. Create `.env` file:
```
AUTH_ORIGIN=http://localhost:3001
AUTH_SECRET=your-secret-key-here
```

3. Create `~/server/api/auth/[...].ts`:
```typescript
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Your auth logic here
        const user = await validateUser(credentials)
        return user ? { id: user.id, email: user.email } : null
      }
    })
  ]
})
```

### Usage in Components
```vue
<script setup>
const { data, signIn, signOut } = useAuth()

const login = async () => {
  await signIn('credentials', {
    email: 'user@example.com',
    password: 'password',
    redirect: false
  })
}
</script>
```

### Pros
- ✅ Built specifically for Nuxt 3
- ✅ Active development and community
- ✅ Supports multiple providers (Google, GitHub, etc.)
- ✅ TypeScript support
- ✅ Server-side session management

### Cons
- ⚠️ Requires understanding of NextAuth.js concepts
- ⚠️ More complex setup for custom backends

---

## Option 2: @nuxtjs/auth-next
**Traditional Nuxt auth module (community maintained)**

### Installation Steps
```bash
pnpm add --exact @nuxtjs/auth-next
pnpm add @nuxtjs/axios
```

### Configuration
1. Add to `nuxt.config.ts`:
```typescript
modules: ['nuxt-gtag', '@nuxtjs/axios', '@nuxtjs/auth-next']

auth: {
  strategies: {
    local: {
      token: {
        property: 'token',
        global: true,
        required: true,
        type: 'Bearer'
      },
      user: {
        property: 'user',
        autoFetch: true
      },
      endpoints: {
        login: { url: '/api/auth/login', method: 'post' },
        logout: { url: '/api/auth/logout', method: 'post' },
        user: { url: '/api/auth/user', method: 'get' }
      }
    }
  }
}

axios: {
  baseURL: 'http://localhost:3001'
}
```

### Usage in Components
```vue
<script setup>
const { $auth } = useNuxtApp()

const login = async () => {
  try {
    await $auth.loginWith('local', {
      data: {
        email: 'user@example.com',
        password: 'password'
      }
    })
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>
```

### Pros
- ✅ Familiar API for Nuxt 2 users
- ✅ Well-documented
- ✅ Multiple strategy support
- ✅ Token management built-in

### Cons
- ⚠️ Not officially maintained by Nuxt team
- ⚠️ Less active development
- ⚠️ May have compatibility issues with newer Nuxt versions

---

## Option 3: JWT with Custom Implementation
**Build your own authentication using JWT tokens**

### Installation Steps
```bash
pnpm add jsonwebtoken bcryptjs
pnpm add -D @types/jsonwebtoken @types/bcryptjs
```

### Implementation Steps

1. Create `~/composables/useAuth.ts`:
```typescript
export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const token = useCookie('auth-token', { 
    default: () => null,
    secure: true,
    sameSite: 'strict'
  })

  const login = async (credentials: LoginCredentials) => {
    const { data } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
    
    token.value = data.token
    user.value = data.user
    
    await navigateTo('/dashboard')
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    token.value = null
    user.value = null
    await navigateTo('/login')
  }

  const checkAuth = async () => {
    if (token.value) {
      try {
        const data = await $fetch('/api/auth/me')
        user.value = data.user
      } catch {
        token.value = null
        user.value = null
      }
    }
  }

  return {
    user: readonly(user),
    login,
    logout,
    checkAuth,
    isLoggedIn: computed(() => !!user.value)
  }
}
```

2. Create `~/server/api/auth/login.post.ts`:
```typescript
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  
  // Validate user credentials (replace with your logic)
  const user = await validateUserCredentials(email, password)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }
  
  const token = jwt.sign(
    { userId: user.id },
    useRuntimeConfig().jwtSecret,
    { expiresIn: '7d' }
  )
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }
})
```

3. Create auth middleware `~/middleware/auth.ts`:
```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()
  
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
})
```

### Usage in Components
```vue
<script setup>
const { login, user, isLoggedIn, logout } = useAuth()

const credentials = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  await login(credentials.value)
}
</script>
```

### Pros
- ✅ Full control over authentication flow
- ✅ No external dependencies
- ✅ Customizable to specific needs
- ✅ Lightweight implementation

### Cons
- ⚠️ More development time required
- ⚠️ Need to handle security considerations manually
- ⚠️ Token refresh logic needs implementation

---

## Option 4: OAuth with External Providers
**Use third-party authentication (Google, GitHub, etc.)**

### Using @sidebase/nuxt-auth with OAuth

1. Install and configure as in Option 1
2. Add OAuth providers:
```typescript
// server/api/auth/[...].ts
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

export default NuxtAuthHandler({
  providers: [
    GoogleProvider({
      clientId: useRuntimeConfig().googleClientId,
      clientSecret: useRuntimeConfig().googleClientSecret,
    }),
    GitHubProvider({
      clientId: useRuntimeConfig().githubClientId,
      clientSecret: useRuntimeConfig().githubClientSecret,
    })
  ]
})
```

3. Environment variables:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Pros
- ✅ No password management
- ✅ Users trust established providers
- ✅ Quick implementation
- ✅ Secure by default

### Cons
- ⚠️ Dependent on external services
- ⚠️ Users need accounts with providers
- ⚠️ Less control over user experience

---

## Option 5: Session-based Authentication
**Traditional server-side sessions**

### Installation Steps
```bash
pnpm add express-session connect-redis redis
```

### Implementation
1. Configure session middleware in `~/server/middleware/session.ts`:
```typescript
import session from 'express-session'

export default defineEventHandler(async (event) => {
  // Session configuration
  const sessionConfig = {
    secret: useRuntimeConfig().sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  }
  
  // Apply session middleware
  await new Promise((resolve, reject) => {
    session(sessionConfig)(event.node.req, event.node.res, (err) => {
      if (err) reject(err)
      else resolve(undefined)
    })
  })
})
```

### Pros
- ✅ Traditional, well-understood approach
- ✅ Server-side session storage
- ✅ Can revoke sessions easily

### Cons
- ⚠️ Requires session storage (Redis, DB)
- ⚠️ More complex scaling
- ⚠️ Stateful server requirement

---

## Decision Matrix

| Feature | @sidebase/nuxt-auth | @nuxtjs/auth-next | Custom JWT | OAuth Only | Sessions |
|---------|-------------------|------------------|------------|------------|----------|
| Ease of Setup | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Maintenance | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Flexibility | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Security | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| TypeScript | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## Recommended Next Steps

### For Most Use Cases (Recommended)
**Choose Option 1: @sidebase/nuxt-auth**
- Modern, actively maintained
- Great TypeScript support
- Flexible provider options
- Good documentation

### For Simple Requirements
**Choose Option 3: Custom JWT**
- Full control
- Lightweight
- Perfect for learning

### For Enterprise/OAuth-only
**Choose Option 4: OAuth with External Providers**
- Most secure
- User-friendly
- No password management

---

## Migration from Current State

### Current Cleanup Status ✅
- ✅ `nuxt-sanctum-auth` package removed
- ✅ Sanctum references cleaned from components
- ✅ CORS configuration simplified
- ✅ Build process working correctly

### Files to Update When Implementing Auth
1. `nuxt.config.ts` - Add auth module configuration
2. `pages/Lagin.vue` - Replace placeholder login logic
3. `pages/Example.vue` - Replace placeholder login logic
4. `composables/useAuth.js` - Update or replace with new auth logic
5. Add middleware for protected routes
6. Create authentication API endpoints

### Environment Variables to Add
```env
# For JWT-based auth
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=your-database-connection-string

# For OAuth providers
AUTH_SECRET=your-auth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# For API backends
API_BASE_URL=http://localhost:8000
```

---

## Additional Considerations

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Validate all inputs
- [ ] Implement proper error handling
- [ ] Use secure cookie settings
- [ ] Add password strength requirements
- [ ] Implement account lockout policies

### Performance Considerations
- [ ] Implement token refresh logic
- [ ] Add authentication caching
- [ ] Optimize database queries
- [ ] Consider CDN for static assets
- [ ] Implement proper session management

### User Experience
- [ ] Add loading states
- [ ] Implement proper error messages
- [ ] Add password reset functionality
- [ ] Consider remember me functionality
- [ ] Add email verification
- [ ] Implement social login options

---

*This roadmap was created on July 17, 2025, after successfully removing nuxt-sanctum-auth from the project. Update this document as requirements change or new auth solutions become available.*
