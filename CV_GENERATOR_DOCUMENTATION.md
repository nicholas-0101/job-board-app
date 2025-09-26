# 📄 CV Generator - Technical Documentation

## 🏗️ Architecture Overview

### Frontend Architecture
```
src/app/cv-generator/page.tsx           # Main CV Generator Page
src/components/cv-generator/
├── useCVGenerator.ts                   # Custom Hook (State Management)
├── CVForm.tsx                          # Form Component
├── MyCVsList.tsx                       # CV List Component
├── SubscriptionWarning.tsx             # Subscription Alert
└── types.ts                            # TypeScript Interfaces
```

### Backend API Structure
```
Base URL: http://localhost:4400
Authentication: Bearer Token (JWT)
Content-Type: application/json
```

---

## 🔐 Authentication & Authorization Flow

### 1. Authentication Check
```typescript
// Frontend Logic
const checkAuth = () => {
  const token = localStorage.getItem("token");
  setIsAuthenticated(!!token);
};
```

### 2. Subscription Validation
```typescript
// API Call
GET /subscription/my-active-subscription
Headers: {
  Authorization: Bearer <jwt_token>
}

// Response
{
  "success": true,
  "data": {
    "isActive": true,
    "plan": "professional",
    "expiresAt": "2024-02-26T14:05:41Z"
  }
}
```

---

## 🎯 Core Features & Logic

### 1. **CV Generation Process**

#### Frontend Form Data Structure
```typescript
interface CVFormData {
  templateId: string;        // "ats" | "modern" | "creative"
  fullName: string;          // Required
  email: string;             // Required
  phone: string;
  address: string;
  summary: string;
  experience: string;        // Multi-line text
  education: string;
  skills: string;            // Comma-separated
  languages: string;         // Comma-separated
  certifications: string;    // Comma-separated
  linkedin: string;
  portfolio: string;
}
```

#### Data Transformation Logic
```typescript
const transformFormData = (formData: CVFormData) => {
  return {
    templateType: formData.templateId,
    additionalInfo: {
      objective: formData.summary || undefined,
      
      // Skills: "React, Node.js, Python" → ["React", "Node.js", "Python"]
      skills: formData.skills 
        ? formData.skills.split(",").map(s => s.trim()) 
        : undefined,
      
      // Experience: Multi-line text → Structured object
      workExperience: formData.experience ? [{
        company: "Various",
        responsibilities: formData.experience
          .split("\n")
          .filter(line => line.trim())
      }] : undefined,
      
      // Languages: "English, Indonesian" → [{name: "English", level: "Intermediate"}]
      languages: formData.languages 
        ? formData.languages.split(",").map(lang => ({
            name: lang.trim(),
            level: "Intermediate"
          }))
        : undefined,
      
      // Certifications: "AWS, Google Cloud" → [{name: "AWS", issuer: "Various"}]
      certifications: formData.certifications 
        ? formData.certifications.split(",").map(cert => ({
            name: cert.trim(),
            issuer: "Various",
            date: new Date().getFullYear().toString()
          }))
        : undefined
    }
  };
};
```

### 2. **Error Handling Matrix**

| Error Code | Condition | Frontend Action | User Message |
|------------|-----------|-----------------|--------------|
| 401 | No/Invalid Token | Redirect to login | "Please sign in to generate CVs" |
| 403 | No Subscription | Show subscription warning | "Active subscription required" |
| 403 | Limit Reached | Block generation | "CV generation limit reached" |
| 403 | Template Restricted | Disable template | "Template not available in your plan" |
| 500 | Server Error | Show error toast | "Failed to generate CV" |

### 3. **File Download Logic**

```typescript
const downloadCV = async (cvId: string, fileName: string) => {
  // 1. Request file as blob
  const response = await apiCall.get(`/cv/${cvId}/download`, {
    responseType: "blob"
  });

  // 2. Create blob URL
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  // 3. Programmatic download
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();

  // 4. Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(anchor);
};
```

---

## 🧪 API Testing with Postman

### Collection Setup
```json
{
  "info": {
    "name": "CV Generator API",
    "description": "Testing CV Generator endpoints"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4400"
    },
    {
      "key": "token",
      "value": "{{jwt_token}}"
    }
  ]
}
```

### 1. **Authentication Test**

#### Login to Get Token
```http
POST {{baseUrl}}/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Postman Test Script:**
```javascript
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.token).to.exist;
    
    // Save token for subsequent requests
    pm.collectionVariables.set("token", response.token);
});
```

### 2. **Subscription Check Test**

```http
GET {{baseUrl}}/subscription/my-active-subscription
Authorization: Bearer {{token}}
```

**Expected Response (Active):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "planType": "professional",
    "isActive": true,
    "startDate": "2024-01-26T14:05:41Z",
    "endDate": "2024-02-26T14:05:41Z"
  }
}
```

**Expected Response (No Subscription):**
```json
{
  "success": false,
  "message": "No active subscription found",
  "error_code": "NO_SUBSCRIPTION"
}
```

**Postman Test Script:**
```javascript
pm.test("Subscription check", function () {
    const response = pm.response.json();
    
    if (pm.response.code === 200) {
        pm.expect(response.data.isActive).to.be.true;
        pm.collectionVariables.set("hasSubscription", "true");
    } else if (pm.response.code === 404) {
        pm.collectionVariables.set("hasSubscription", "false");
    }
});
```

### 3. **Get CV Templates Test**

```http
GET {{baseUrl}}/cv/templates
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "ats",
      "name": "ATS-Friendly Template",
      "description": "Clean, professional template optimized for ATS",
      "preview": "/templates/ats-preview.png",
      "requiredPlan": "standard"
    },
    {
      "id": "modern",
      "name": "Modern Template",
      "description": "Contemporary design with visual elements",
      "preview": "/templates/modern-preview.png",
      "requiredPlan": "professional"
    }
  ]
}
```

**Postman Test Script:**
```javascript
pm.test("Templates loaded", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.templates).to.be.an('array');
    pm.expect(response.templates.length).to.be.greaterThan(0);
});
```

### 4. **Generate CV Test**

```http
POST {{baseUrl}}/cv/generate
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "templateType": "ats",
  "additionalInfo": {
    "objective": "Experienced software developer seeking new opportunities",
    "skills": ["React", "Node.js", "TypeScript", "Python"],
    "workExperience": [
      {
        "company": "Tech Company",
        "responsibilities": [
          "Developed web applications using React",
          "Built REST APIs with Node.js",
          "Collaborated with cross-functional teams"
        ]
      }
    ],
    "educationDetails": [
      {
        "institution": "University of Technology",
        "degree": "Bachelor of Computer Science",
        "year": "2020"
      }
    ],
    "languages": [
      {
        "name": "English",
        "level": "Fluent"
      },
      {
        "name": "Indonesian",
        "level": "Native"
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Developer",
        "issuer": "Amazon Web Services",
        "date": "2023"
      }
    ],
    "linkedin": "https://linkedin.com/in/johndoe",
    "portfolio": "https://johndoe.dev"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "CV generated successfully",
  "data": {
    "cvId": "cv_123456789",
    "fileName": "John_Doe_CV_2024.pdf",
    "createdAt": "2024-01-26T14:05:41Z",
    "templateUsed": "ats",
    "downloadUrl": "/cv/cv_123456789/download"
  }
}
```

**Postman Test Script:**
```javascript
pm.test("CV generated successfully", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.cvId).to.exist;
    
    // Save CV ID for download test
    pm.collectionVariables.set("cvId", response.data.cvId);
    pm.collectionVariables.set("fileName", response.data.fileName);
});

pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(10000); // 10 seconds max
});
```

### 5. **Get User CVs Test**

```http
GET {{baseUrl}}/cv
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "cvs": [
      {
        "id": "cv_123456789",
        "fileName": "John_Doe_CV_2024.pdf",
        "templateType": "ats",
        "createdAt": "2024-01-26T14:05:41Z",
        "fileSize": "245KB",
        "downloadCount": 3
      }
    ],
    "total": 1,
    "limit": 10
  }
}
```

**Postman Test Script:**
```javascript
pm.test("CVs list retrieved", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.data.cvs).to.be.an('array');
});
```

### 6. **Download CV Test**

```http
GET {{baseUrl}}/cv/{{cvId}}/download
Authorization: Bearer {{token}}
```

**Expected Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="John_Doe_CV_2024.pdf"`
- Binary PDF data

**Postman Test Script:**
```javascript
pm.test("CV download successful", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/pdf');
});

pm.test("File size is reasonable", function () {
    const contentLength = pm.response.headers.get('Content-Length');
    pm.expect(parseInt(contentLength)).to.be.greaterThan(1000); // At least 1KB
});
```

### 7. **Delete CV Test**

```http
DELETE {{baseUrl}}/cv/{{cvId}}
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "CV deleted successfully"
}
```

**Postman Test Script:**
```javascript
pm.test("CV deleted successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
});
```

---

## 🚨 Error Scenarios Testing

### 1. **Unauthorized Access**
```http
GET {{baseUrl}}/cv/templates
# No Authorization header
```
**Expected:** `401 Unauthorized`

### 2. **Invalid Token**
```http
GET {{baseUrl}}/cv/templates
Authorization: Bearer invalid_token_here
```
**Expected:** `401 Unauthorized`

### 3. **No Subscription**
```http
POST {{baseUrl}}/cv/generate
Authorization: Bearer {{token}}
# User without active subscription
```
**Expected:** `403 Forbidden`

### 4. **Generation Limit Exceeded**
```http
POST {{baseUrl}}/cv/generate
Authorization: Bearer {{token}}
# User has reached monthly limit
```
**Expected:** `403 Forbidden` with specific error message

### 5. **Invalid Template**
```http
POST {{baseUrl}}/cv/generate
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "templateType": "non_existent_template"
}
```
**Expected:** `400 Bad Request`

---

## 🔄 Complete Test Flow

### Postman Collection Runner Sequence:
1. **Login** → Get JWT token
2. **Check Subscription** → Verify access rights
3. **Get Templates** → Load available templates
4. **Generate CV** → Create new CV
5. **Get CVs List** → Verify CV was created
6. **Download CV** → Test file download
7. **Delete CV** → Cleanup test data

### Environment Variables:
```json
{
  "baseUrl": "http://localhost:4400",
  "testEmail": "test@example.com",
  "testPassword": "password123",
  "token": "{{jwt_token}}",
  "cvId": "{{generated_cv_id}}",
  "fileName": "{{generated_filename}}"
}
```

---

## 📊 Performance Benchmarks

| Operation | Expected Response Time | Max File Size |
|-----------|----------------------|---------------|
| Login | < 500ms | N/A |
| Subscription Check | < 300ms | N/A |
| Get Templates | < 200ms | N/A |
| Generate CV | < 10s | 5MB |
| Download CV | < 3s | 5MB |
| Delete CV | < 500ms | N/A |

---

## 🛠️ Troubleshooting Guide

### Common Issues:

1. **"Module not found: zustand"**
   ```bash
   npm install zustand
   ```

2. **"Authentication required"**
   - Check if token exists in localStorage
   - Verify token is not expired
   - Ensure Authorization header is set

3. **"Subscription required"**
   - Verify user has active subscription
   - Check subscription expiry date
   - Validate plan permissions

4. **CV Generation fails**
   - Check required fields (fullName, email)
   - Verify template exists
   - Check subscription limits

5. **Download not working**
   - Ensure responseType: "blob"
   - Check file permissions
   - Verify CV exists in database

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- File sizes are calculated in bytes
- PDF generation may take 5-10 seconds for complex CVs
- Download links expire after 24 hours
- Maximum 10 CVs per user on Standard plan
- Unlimited CVs on Professional plan
