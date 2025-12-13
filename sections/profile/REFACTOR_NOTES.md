# EditProfileContent Refactor Summary

## Overview

Completely refactored the EditProfileContent component to use Formik for form state management, Yup for validation, and broke it into smaller, reusable sub-components.

## Files Created

### 1. **validationSchema.ts**

- Yup validation schema for the profile editing form
- Validates: firstName, lastName, zip, email, phoneNumber, experiences, educations, skills
- Email format validation with regex
- Phone number format validation
- Conditional validation for end dates (required when not current)

### 2. **PersonalInfoSection.tsx**

- Displays and edits personal information (firstName, lastName, zip)
- Shows current email and phone with "Change" buttons
- Integrated with Formik for state management and validation
- Opens email/phone verification modals on "Change" button press

### 3. **CVSection.tsx**

- Document picker for PDF/CV upload
- Shows uploaded file with remove option
- Integrated with Formik's `cvFile` field

### 4. **ExperienceSection.tsx**

- Dynamic add/remove experience entries
- Uses Formik's FieldArray for managing array of experiences
- Fields: position, company, startDate, endDate, current (checkbox)
- Validation errors displayed per field

### 5. **EducationSection.tsx**

- Dynamic add/remove education entries
- Uses Formik's FieldArray for managing array of educations
- Fields: degree, institution, startDate, endDate
- Validation errors displayed per field

### 6. **SkillsSection.tsx**

- Skill tagging system with add/remove
- Text input with "Add" button
- Displays skills as removable pills/badges
- Integrated with Formik

### 7. **BioSection.tsx**

- Multiline text input for user bio
- Character counter (max 500 characters)
- Integrated with Formik validation

### 8. **EmailVerificationModal.tsx**

- Two-step modal: email input → code verification
- Sends verification code to new email
- User enters 6-digit code for verification
- Calls `onVerify()` and updates Formik on success

### 9. **PhoneVerificationModal.tsx**

- Two-step modal: phone input → code verification
- Similar structure to EmailVerificationModal
- Phone number input with code verification
- Calls `onVerify()` and updates Formik on success

## Files Modified

### EditProfileContent.tsx

**Before:**

- Static state with mock data
- No form validation
- No API integration
- Monolithic component with 500+ lines

**After:**

- Formik integration with validation schema
- Dynamically populated from user API (useGetCvDetailsQuery)
- Save button calls API (useUpdateCvDetailsMutation, etc.)
- Decomposed into 8+ smaller sub-components
- Loading state while fetching profile data
- Error handling with Alert notifications
- Form submission with loading state

## Key Features

### Form Management

- **Formik** for form state, validation, and submission
- **Yup** schema validation for all fields
- Real-time field-level validation errors
- Form reset with "Cancel" button
- Submit button disabled while form is invalid or submitting

### Email/Phone Verification

- Two-step verification modals
- Email verification before updating email in form
- Phone verification before updating phone in form
- Code input with placeholder format (000000)
- Error handling for failed verification

### API Integration

- **GET /api/profile/cv-details** - Fetch user profile data
- **PUT /api/profile/cv-details** - Save CV details (experiences, educations, skills, bio, resume)
- **PUT /api/user/me** - Update general info (firstName, lastName, email)
- **PUT /api/user/profile** - Update profile picture

### Validation Rules

- **firstName/lastName:** Required, min 2 characters
- **zip:** Required, min 3 characters
- **email:** Required, valid email format
- **phoneNumber:** Required, valid phone format
- **bio:** Max 500 characters
- **experiences/educations:** Required fields per entry
- **endDate:** Required when "current" is false

## Component Structure

```
EditProfileContent (Main, with Formik)
├── ProfilePictureSection (inline)
├── PersonalInfoSection
├── CVSection
├── ExperienceSection (with FieldArray)
├── EducationSection (with FieldArray)
├── SkillsSection
├── BioSection
├── EmailVerificationModal
└── PhoneVerificationModal
```

## Usage Example

```tsx
import EditProfileContent from "@/sections/profile/EditProfileContent";

// Use in dashboard
<EditProfileContent />;
```

## Next Steps (TODO)

1. Implement email verification API endpoints:
   - POST /api/profile/send-email-verification
   - POST /api/profile/verify-email

2. Implement phone verification API endpoints:
   - POST /api/profile/send-phone-verification
   - POST /api/profile/verify-phone

3. Update `handleEmailVerify()` and `handlePhoneVerify()` to call verification endpoints

4. Add location/ZIP API integration (currently hardcoded to empty string)

5. Add image upload to AWS S3 or similar before sending to API

6. Handle file upload for CV (multipart form data)

7. Add loading indicator for image/file uploads

## Dependencies

- **formik** ^2.4.6 (already installed)
- **yup** ^1.6.1 (already installed)
- **expo-image-picker** ^16.1.4 (already installed)
- **expo-document-picker** ^13.1.6 (already installed)

## Styling

- NativeWind/Tailwind CSS with azure-radiance (#1eadff) theme
- Consistent with existing app design
- Responsive layout with proper spacing
- Error states with red text
- Loading states with ActivityIndicator
