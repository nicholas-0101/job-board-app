# Developer Block Guard

## Overview

`DeveloperBlockGuard` adalah middleware yang mencegah developer mengakses halaman user. Guard ini akan menampilkan pesan error dan redirect ke developer dashboard jika user yang login adalah developer.

## Usage

### Import

```tsx
import DeveloperBlockGuard from "@/components/auth/DeveloperBlockGuard";
```

### Implementation

```tsx
export default function UserPage() {
  return (
    <DeveloperBlockGuard>
      <div>{/* Konten halaman user */}</div>
    </DeveloperBlockGuard>
  );
}
```

## Features

- ✅ Mencegah developer mengakses halaman user
- ✅ Menampilkan pesan error yang jelas
- ✅ Redirect ke developer dashboard
- ✅ Loading state saat pengecekan
- ✅ Responsive design
- ✅ Design konsisten dengan landing page (warna #467EC7 dan #F0F5F9)

## Halaman yang Sudah Dilindungi

- `/my-applications` - Halaman aplikasi user
- `/saved-jobs` - Halaman job yang disimpan
- `/subscription` - Halaman subscription
- `/skill-assessments` - Halaman skill assessment
- `/cv-generator` - Halaman CV generator

## Design

- **Background**: `#F0F5F9` (konsisten dengan landing page)
- **Primary Color**: `#467EC7` (warna utama aplikasi)
- **Card**: White background dengan shadow
- **Border**: `#467EC7` dengan opacity 20%
- **No Gradients**: Design flat tanpa gradasi

## Error Message

Jika developer mencoba mengakses halaman user, akan muncul pesan:

- **Title**: "Access Restricted"
- **Message**: "Developers cannot access user-specific features. Please use the developer dashboard."
- **Actions**:
  - "Go to Developer Dashboard" (redirect ke `/developer`)
  - "Go Back" (kembali ke halaman sebelumnya)
