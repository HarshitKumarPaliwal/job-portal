# Job Portal (MERN)

Do roles: **Job Seeker** (jobs dekhe, search kare, apply kare) aur **Recruiter** (job post/update/delete kare, applicants dekhe).

## Run kaise kare

1. MongoDB local chalu rakho (ya Atlas ka URL `.env` me do).

2. Backend (port 3200):
   cd server
   npm install
   copy .env.example to .env
   npm run dev

3. Frontend (port 5173):
   cd client
   npm install
   npm run dev

Browser me http://localhost:5173 kholo.

## Test flow
1. Ek account **Recruiter** role se signup karo -> Post Job -> job daalo.
2. Logout karke dusra account **Job Seeker** se signup karo -> Jobs me Apply dabao.
3. Wapas recruiter se login -> My Jobs -> Applicants.

## API list
| Method | URL | Kaun |
|---|---|---|
| POST | /signup, /login, /logout | sab |
| GET | /jobs?search= | logged-in |
| POST | /add-job | recruiter |
| GET | /my-jobs, /jobs/:id | recruiter |
| PUT | /update-job | recruiter |
| DELETE | /delete-job/:id | recruiter |
| GET | /applicants/:id | recruiter |
| POST | /apply/:id | jobseeker |
| GET | /my-applications | jobseeker |
