C:\Users\PC\Document…t\src\lib\api.js:55

GET http://localhost:3000/api/v1/auth/verify-token 401 (Unauthorized)
C:\Users\PC\Document…t\src\lib\api.js:99
API Error: 401 - User not found
C:\Users\PC\Document…\src\lib\api.js:103
Error in requestWithAuth: ApiError: User not found
at requestWithAuth (C:\Users\PC\Document…c\lib\api.js:100:13)
at async AuthProvider.useCallback[checkAuth] (C:\Users\PC\Document…c\lib\auth.js:75:32)
C:\Users\PC\Document…\src\lib\auth.js:82
Verification after refresh failed: ApiError: User not found
at requestWithAuth (C:\Users\PC\Document…c\lib\api.js:100:13)
at async AuthProvider.useCallback[checkAuth] (C:\Users\PC\Document…c\lib\auth.js:75:32)
