# Authentication Setup Documentation

## Overview
The authentication system is fully configured using Supabase Auth with support for:
- Email/Password authentication
- Google OAuth
- Protected routes
- User session management
- Profile management

## Components Created

### 1. Auth Context (`src/contexts/AuthContext.jsx`)
Centralized authentication state management that provides:
- `user`: Current authenticated user object
- `session`: Current session object
- `loading`: Loading state during auth initialization
- `signOut()`: Function to sign out the user

**Usage:**
```jsx
import { useAuth } from "@/contexts/AuthContext";

const MyComponent = () => {
  const { user, loading, signOut } = useAuth();
  // Use auth state
};
```

### 2. Protected Route Component (`src/components/ProtectedRoute.jsx`)
Wrapper component that protects routes requiring authentication.
- Shows loading spinner while checking auth state
- Redirects to `/auth` if user is not authenticated
- Renders children if user is authenticated

**Usage:**
```jsx
<Route
  path="/protected-page"
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  }
/>
```

### 3. Auth Page (`src/pages/Auth.jsx`)
Complete authentication page with:
- Email/Password sign in and sign up
- Google OAuth integration
- Form validation using Zod
- Email verification flow
- Automatic redirect after successful auth
- Toggle between sign in and sign up modes

### 4. Updated Navbar (`src/components/Navbar.jsx`)
Enhanced navbar with:
- User avatar dropdown menu
- Display user email
- Sign out functionality
- Conditional rendering based on auth state
- Links to protected pages (Wishlist, Compare)

### 5. UI Components
Created shadcn/ui components:
- `Avatar` - User avatar display
- `DropdownMenu` - User menu dropdown

## Database Schema

### Tables Created (via Supabase migration)

#### `profiles`
- `id` (UUID, references auth.users)
- `username` (TEXT, unique)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Features:**
- Auto-created on user signup via trigger
- Row Level Security (RLS) enabled
- Users can update their own profile

#### `wishlists`
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `country_code` (TEXT)
- `country_name` (TEXT)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)

**Features:**
- RLS enabled
- Users can only access their own wishlists
- Unique constraint on (user_id, country_code)

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

## Protected Routes

The following routes are protected and require authentication:
- `/wishlist` - User's saved countries
- `/compare` - Country comparison tool

## Authentication Flow

### Sign Up Flow
1. User enters email and password
2. Supabase creates auth user
3. Trigger automatically creates profile record
4. Verification email sent
5. User redirected to home page

### Sign In Flow
1. User enters credentials or uses Google OAuth
2. Supabase validates credentials
3. Session created and stored in localStorage
4. Auth context updates with user data
5. User redirected to home page

### Protected Route Access
1. User navigates to protected route
2. ProtectedRoute component checks auth state
3. If authenticated: renders page
4. If not authenticated: redirects to `/auth`

### Sign Out Flow
1. User clicks sign out in dropdown menu
2. Supabase clears session
3. Auth context updates (user = null)
4. User redirected to home page

## Google OAuth Setup

To enable Google OAuth in Supabase:
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add OAuth credentials from Google Cloud Console
4. Configure authorized redirect URIs

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies:
- Users can only read/write their own data
- Profiles are publicly readable
- Wishlists are private to the owner

### Session Management
- Sessions persist in localStorage
- Auto-refresh tokens enabled
- Automatic session validation on page load

### Protected Routes
- Client-side route protection via ProtectedRoute component
- Server-side protection via RLS policies
- Loading states prevent flash of unauthorized content

## Testing the Auth System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Sign Up:**
   - Navigate to `/auth?mode=signup`
   - Enter email and password
   - Check email for verification link

3. **Test Sign In:**
   - Navigate to `/auth`
   - Enter credentials
   - Verify redirect to home page

4. **Test Google OAuth:**
   - Click "Continue with Google"
   - Complete Google authentication
   - Verify redirect to home page

5. **Test Protected Routes:**
   - Sign out
   - Try accessing `/wishlist` or `/compare`
   - Verify redirect to `/auth`

6. **Test User Menu:**
   - Sign in
   - Click avatar in navbar
   - Verify email display
   - Test sign out

## Troubleshooting

### Common Issues

**Issue: "Invalid API key"**
- Check `.env` file has correct Supabase credentials
- Restart dev server after changing `.env`

**Issue: Google OAuth not working**
- Verify Google provider is enabled in Supabase
- Check redirect URIs are configured correctly
- Ensure OAuth credentials are valid

**Issue: Protected routes not redirecting**
- Check AuthProvider wraps the entire app
- Verify ProtectedRoute is used correctly
- Check browser console for errors

**Issue: User data not persisting**
- Check localStorage is enabled
- Verify RLS policies are correct
- Check Supabase connection

## Next Steps

Potential enhancements:
- Add password reset functionality
- Implement email change feature
- Add profile editing page
- Add more OAuth providers (GitHub, Facebook, etc.)
- Implement remember me functionality
- Add two-factor authentication
- Create admin roles and permissions
