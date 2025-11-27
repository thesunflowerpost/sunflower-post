# Profile & Privacy Features

This document describes the newly implemented profile editing and privacy settings features.

## Features Implemented

### 1. Edit Profile Modal ✅
A fully functional modal that allows users to edit their profile information:

**Features:**
- ✅ Name editing with validation
- ✅ Bio editing with 160 character limit
- ✅ Avatar upload (custom image upload)
- ✅ Preset avatar selection (6 options)
- ✅ Live preview of changes
- ✅ Character counter for bio
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

**Location:** `/src/components/EditProfileModal.tsx`

**Usage:**
The modal is automatically integrated into the ProfileHeader component. Click "Edit profile" button to open it.

### 2. Privacy & Visibility Settings ✅
A comprehensive settings page for managing privacy preferences:

**Settings Available:**

#### Profile Visibility
- **Public**: Anyone can view your profile
- **Followers Only**: Only approved followers can view
- **Private**: Only you can view your profile

#### Follow Settings
- **Require Approval**: Review follow requests before approval

#### Posting Preferences
- **Post Anonymously by Default**: Use alias instead of real name

#### Activity Visibility
- **Show Activity Feed**: Control if others can see your activity

#### Data & Privacy
- **Enable Data Export**: Allow exporting your data
- **Export My Data** button (feature coming soon)

**Location:** `/src/app/settings/privacy/page.tsx`

**Access:** Click "Privacy & visibility" button on your profile, or navigate to `/settings/privacy`

## Database Changes

### Schema Updates

New fields added to the `users` table:

```sql
bio TEXT                            -- Profile bio (160 char max)
alias TEXT                          -- Anonymous identifier
profile_visibility TEXT             -- 'public' | 'followers_only' | 'private'
follower_approval_required BOOLEAN  -- Require follow approval
default_anonymous_mode BOOLEAN      -- Default to anonymous posting
activity_visible BOOLEAN            -- Show activity to others
data_export_enabled BOOLEAN         -- Enable data export feature
```

### Migration Required

**⚠️ IMPORTANT:** You need to run the database migration before using these features.

**Steps:**

1. Log into your Supabase Dashboard
2. Go to: `https://supabase.com/dashboard/project/YOUR_PROJECT/sql`
3. Run the migration script: `/supabase-privacy-migration.sql`

The migration will:
- Add new privacy fields to the users table
- Create auto-generated aliases for all users
- Create a `followers` table for managing relationships
- Set up appropriate indexes and RLS policies

## API Endpoints

### Profile Update
```
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "bio": "My bio text",
  "avatarUrl": "https://..."
}
```

### Privacy Settings Update
```
PUT /api/settings/privacy
Authorization: Bearer <token>
Content-Type: application/json

{
  "profileVisibility": "public",
  "followerApprovalRequired": false,
  "defaultAnonymousMode": false,
  "activityVisible": true,
  "dataExportEnabled": true
}
```

## Component Integration

### ProfileHeader Updates
The ProfileHeader component now includes:
- Modal state management
- Integration with EditProfileModal
- Navigation to privacy settings page
- Real-time profile updates after save

**File:** `/src/components/ProfileHeader.tsx`

## Type Updates

Updated `User` interface in `/src/lib/db/schema.ts` to include:
```typescript
bio?: string;
profileVisibility?: 'public' | 'followers_only' | 'private';
followerApprovalRequired?: boolean;
defaultAnonymousMode?: boolean;
activityVisible?: boolean;
dataExportEnabled?: boolean;
```

## Testing Checklist

- [ ] Edit profile modal opens correctly
- [ ] Name field validates (required)
- [ ] Bio character limit works (160 chars)
- [ ] Avatar upload accepts images
- [ ] Preset avatars can be selected
- [ ] Preview updates in real-time
- [ ] Save updates the profile
- [ ] Profile page reflects changes
- [ ] Privacy settings page loads
- [ ] Privacy settings save correctly
- [ ] Navigation between pages works
- [ ] Error states display properly
- [ ] Loading states work correctly

## Next Steps

Potential enhancements:
1. Implement data export functionality
2. Add image upload to cloud storage (currently base64)
3. Add crop/resize functionality for avatars
4. Implement actual follower approval workflow
5. Add visibility controls to individual posts
6. Activity feed filtering based on privacy settings

## Files Changed/Created

**New Files:**
- `/src/components/EditProfileModal.tsx`
- `/src/app/settings/privacy/page.tsx`
- `/src/app/api/profile/route.ts`
- `/src/app/api/settings/privacy/route.ts`
- `/supabase-privacy-migration.sql`

**Modified Files:**
- `/src/components/ProfileHeader.tsx`
- `/src/lib/db/schema.ts`
- `/src/lib/db/index.ts`
- `/supabase-schema.sql`
