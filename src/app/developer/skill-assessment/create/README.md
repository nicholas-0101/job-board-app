# Create Assessment Feature

## Overview
This feature allows developers to create skill assessment tests with multiple choice questions.

## Files Structure
```
create/
├── page.tsx (198 lines) - Main create assessment page
├── components/
│   ├── QuestionForm.tsx (110 lines) - Individual question form component
│   └── BadgeSelector.tsx (79 lines) - Badge template selector
└── README.md - This file
```

## API Integration

### Endpoint Used
- **POST** `/skill-assessment/assessments`
- **GET** `/skill-assessment/badge-templates`

### Request Format
```typescript
{
  title: string;
  description?: string;
  badgeTemplateId?: number;
  questions: [
    {
      question: string;
      options: [string, string, string, string];
      answer: string;
    }
  ];
}
```

## Features
1. **Assessment Information**
   - Title (required)
   - Description (optional)
   - Badge template selection (optional)

2. **Question Management**
   - Add up to 25 questions
   - Each question has 4 options (A, B, C, D)
   - Select correct answer from dropdown
   - Remove questions (minimum 1 required)

3. **Validation**
   - Title is required
   - At least 1 question required
   - All question fields must be filled
   - Answer must match one of the options

4. **User Experience**
   - Real-time validation
   - Toast notifications for errors/success
   - Loading states
   - Responsive design

## Usage

### For Developers
1. Navigate to `/developer/skill-assessment`
2. Click "Create Assessment" button
3. Fill in assessment information
4. Add questions (minimum 1, maximum 25)
5. Select correct answer for each question
6. Click "Create Assessment"

### Testing
1. Test with valid data
2. Test with missing required fields
3. Test with invalid answer selection
4. Test with maximum questions (25)
5. Test badge template selection

## Error Handling
- Network errors: Shows error toast
- Validation errors: Shows specific field error
- Server errors: Shows server message
- Authentication: Redirects to login

## Next Steps
- Implement edit assessment functionality
- Add question bank feature
- Add preview mode
- Add bulk import questions
