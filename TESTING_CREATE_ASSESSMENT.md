# Testing Guide: Create Assessment Feature

## Prerequisites
1. Backend server running on `http://localhost:4400`
2. Frontend server running on `http://localhost:3000`
3. Developer account with DEVELOPER role
4. Valid authentication token

## Quick Start

### 1. Login as Developer
```
URL: http://localhost:3000/developer/signin
Credentials: Use your developer account
```

### 2. Navigate to Skill Assessment
```
Dashboard → Skill Assessments → Create Assessment
OR
Direct URL: http://localhost:3000/developer/skill-assessment/create
```

### 3. Fill Assessment Form

#### Basic Information
- **Title**: "JavaScript Basics" (required)
- **Description**: "Test fundamental JavaScript concepts" (optional)
- **Badge**: Select from dropdown or leave as "No Badge" (optional)

#### Add Questions
Click "Add Question" button to add questions (max 25)

**Example Question 1:**
- Question: "What is the output of typeof null?"
- Option A: "null"
- Option B: "object"
- Option C: "undefined"
- Option D: "number"
- Correct Answer: Select "object"

**Example Question 2:**
- Question: "Which method adds an element to the end of an array?"
- Option A: "push()"
- Option B: "pop()"
- Option C: "shift()"
- Option D: "unshift()"
- Correct Answer: Select "push()"

### 4. Submit
Click "Create Assessment" button

### 5. Verify Success
- Should see success toast notification
- Should redirect to `/developer/skill-assessment`
- New assessment should appear in the list

## Test Cases

### Test Case 1: Valid Assessment Creation
**Steps:**
1. Fill all required fields
2. Add 3 questions with all details
3. Click "Create Assessment"

**Expected:**
- ✅ Success toast appears
- ✅ Redirects to assessment list
- ✅ New assessment visible

### Test Case 2: Missing Title
**Steps:**
1. Leave title empty
2. Add 1 question
3. Click "Create Assessment"

**Expected:**
- ❌ Error toast: "Title is required"
- ❌ Form not submitted

### Test Case 3: Missing Question Details
**Steps:**
1. Fill title
2. Add question but leave question text empty
3. Click "Create Assessment"

**Expected:**
- ❌ Error toast: "Question 1: Question text is required"
- ❌ Form not submitted

### Test Case 4: Invalid Answer Selection
**Steps:**
1. Fill title
2. Add question with all options
3. Don't select correct answer
4. Click "Create Assessment"

**Expected:**
- ❌ Error toast: "Question 1: Correct answer is required"
- ❌ Form not submitted

### Test Case 5: Maximum Questions
**Steps:**
1. Add 25 questions
2. Try to add 26th question

**Expected:**
- ❌ Error toast: "Maximum 25 questions allowed"
- ❌ Add button disabled

### Test Case 6: Remove Question
**Steps:**
1. Add 3 questions
2. Click trash icon on question 2
3. Verify question removed

**Expected:**
- ✅ Question removed
- ✅ Questions renumbered
- ✅ Can still submit

### Test Case 7: Badge Selection
**Steps:**
1. Fill title
2. Select badge template
3. Add 1 question
4. Submit

**Expected:**
- ✅ Badge selected
- ✅ Assessment created with badge
- ✅ Success message

### Test Case 8: Network Error
**Steps:**
1. Stop backend server
2. Fill form and submit

**Expected:**
- ❌ Error toast: "Failed to create assessment"
- ❌ Form remains filled

### Test Case 9: Authentication Error
**Steps:**
1. Clear localStorage token
2. Try to access create page

**Expected:**
- ❌ Redirects to login page
- ❌ DeveloperAuthGuard blocks access

### Test Case 10: Cancel Creation
**Steps:**
1. Fill form partially
2. Click "Cancel" or "Back" button

**Expected:**
- ✅ Returns to assessment list
- ✅ No data saved

## API Testing with cURL

### Create Assessment
```bash
curl -X POST http://localhost:4400/skill-assessment/assessments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "JavaScript Basics",
    "description": "Test fundamental concepts",
    "questions": [
      {
        "question": "What is closure?",
        "options": ["Function", "Variable", "Scope", "Object"],
        "answer": "Function"
      }
    ]
  }'
```

### Get Badge Templates
```bash
curl -X GET http://localhost:4400/skill-assessment/badge-templates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Debugging

### Check Browser Console
```javascript
// Open DevTools (F12)
// Check for errors in Console tab
// Check Network tab for API calls
```

### Check Network Requests
1. Open DevTools → Network tab
2. Submit form
3. Look for POST request to `/skill-assessment/assessments`
4. Check request payload
5. Check response status and body

### Common Issues

#### Issue: "Failed to create assessment"
**Solution:**
- Check backend server is running
- Verify API endpoint is correct
- Check token is valid

#### Issue: "Unauthorized"
**Solution:**
- Login again
- Check token in localStorage
- Verify DEVELOPER role

#### Issue: Badge templates not loading
**Solution:**
- Check badge templates exist in database
- Verify GET endpoint works
- Check console for errors

#### Issue: Form validation not working
**Solution:**
- Check all required fields filled
- Verify answer matches option
- Check console for validation errors

## Success Criteria
- ✅ Can create assessment with valid data
- ✅ Validation prevents invalid submissions
- ✅ Error messages are clear and helpful
- ✅ Success redirects to assessment list
- ✅ Loading states show during API calls
- ✅ Toast notifications work correctly
- ✅ Mobile responsive design works
- ✅ All buttons and inputs functional

## Performance Checks
- Page loads in < 2 seconds
- Form submission completes in < 3 seconds
- Badge templates load in < 1 second
- No console errors or warnings
- Smooth animations and transitions

## Browser Compatibility
Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Notes
- Keep backend server running during tests
- Use valid developer credentials
- Check console for detailed error messages
- Test both success and error scenarios
- Verify data persistence in database
