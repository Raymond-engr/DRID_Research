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

server logs below

info: GET /api/v1/auth/verify-token {"service":"DRID","timestamp":"2025-04-12T00:55:53.506Z"}
info: Token verification request for user ID: undefined {"service":"DRID","timestamp":"2025-04-12T00:55:53.669Z"}
info: Token verification request for user ID: undefined {"service":"DRID","timestamp":"2025-04-12T00:55:53.669Z"}
warn: Token verification failed: User not found with ID undefined {"service":"DRID","timestamp":"2025-04-12T00:55:53.823Z"}
warn: Token verification failed: User not found with ID undefined {"service":"DRID","timestamp":"2025-04-12T00:55:53.823Z"}
error: Error User not found {"isOperational":true,"service":"DRID","stack":"Error: User not found\n at file:///C:/Users/PC/Documents/Drid_Research/server/src/controllers/auth.controller.js:269:13\n at process.processTicksAndRejections (node:internal/process/task_queues:95:5)","status":"fail","statusCode":401,"timestamp":"2025-04-12T00:55:53.824Z"}
error: Error User not found {"isOperational":true,"service":"DRID","stack":"Error: User not found\n at file:///C:/Users/PC/Documents/Drid_Research/server/src/controllers/auth.controller.js:269:13\n at process.processTicksAndRejections (node:internal/process/task_queues:95:5)","status":"fail","statusCode":401,"timestamp":"2025-04-12T00:55:53.824Z"}
