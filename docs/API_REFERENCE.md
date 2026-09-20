# API Reference

## Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/register` | ❌ | Create account (roles: STUDENT, MENTOR, PLACEMENT_COORDINATOR) |
| `POST` | `/api/v1/auth/login` | ❌ | Login |
| `POST` | `/api/v1/auth/refresh` | ❌ (cookie) | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | ❌ (cookie) | Logout |

## User Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/users/profile` | ✅ Bearer | Get own profile |
| `PUT` | `/api/v1/users/profile` | ✅ Bearer | Update own profile |

## DSA Practice Tracker

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/dsa/dashboard` | ✅ Bearer | Overview stats (total, solved, remaining, by difficulty) |
| `GET` | `/api/v1/dsa/categories` | ✅ Bearer | List all 17 categories with user progress counts |
| `GET` | `/api/v1/dsa/categories/:id/problems` | ✅ Bearer | Problems in a specific category |
| `POST` | `/api/v1/dsa/problems` | ✅ Bearer | Add a problem |
| `PUT` | `/api/v1/dsa/problems/:id` | ✅ Bearer | Modify a problem |
| `DELETE` | `/api/v1/dsa/problems/:id` | ✅ Bearer | Delete a problem |
| `PATCH` | `/api/v1/dsa/problems/:id/status` | ✅ Bearer | Toggle solved/unsolved |

## Private Core Subject Notes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/core-subject-notes` | ✅ Bearer | List own subject notes |
| `POST` | `/api/v1/core-subject-notes` | ✅ Bearer | Add a subject note |
| `PUT` | `/api/v1/core-subject-notes/:id` | ✅ Bearer | Update a subject note |
| `DELETE` | `/api/v1/core-subject-notes/:id` | ✅ Bearer | Delete a subject note |

## Personal Resume

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/personal-resume` | ✅ Bearer | Get saved resume link |
| `POST` | `/api/v1/personal-resume` | ✅ Bearer | Save a resume link (one per user) |
| `PUT` | `/api/v1/personal-resume/:id` | ✅ Bearer | Update resume link |
| `DELETE` | `/api/v1/personal-resume/:id` | ✅ Bearer | Remove saved resume link |

## Mentorship

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/mentors` | ✅ Bearer | List all mentor profiles |
| `GET` | `/api/v1/mentors/profile` | ✅ Bearer | Get own mentor profile |
| `POST` | `/api/v1/mentors/profile` | ✅ Bearer | Create or update mentor profile |
| `POST` | `/api/v1/mentors/:mentorId/request` | ✅ Bearer | Send mentorship request |
| `GET` | `/api/v1/mentors/requests` | ✅ Bearer | Get all requests (sent + received) |
| `PUT` | `/api/v1/mentors/requests/:requestId` | ✅ Bearer | Accept / Reject / Cancel request |

## Events Hub

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/events` | ✅ Bearer | All events |
| `GET` | `/api/v1/events/upcoming` | ✅ Bearer | Upcoming events |
| `GET` | `/api/v1/events/past` | ✅ Bearer | Past events |
| `GET` | `/api/v1/events/:id` | ✅ Bearer | Single event detail |
| `POST` | `/api/v1/events` | 🔒 Coordinator | Publish new event |
| `DELETE` | `/api/v1/events/:id` | 🔒 Coordinator | Delete event |
| `POST` | `/api/v1/events/upload` | 🔒 Coordinator | Upload banner image to Cloudinary |

## Resources Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/resources` | ✅ Bearer | Get all resources (all 4 types) |
| `POST` | `/api/v1/resources/subject-notes` | 🔒 Coordinator | Add subject note |
| `PUT` | `/api/v1/resources/subject-notes/:id` | 🔒 Coordinator | Update subject note |
| `DELETE` | `/api/v1/resources/subject-notes/:id` | 🔒 Coordinator | Delete subject note |
| `POST` | `/api/v1/resources/previous-year-questions` | 🔒 Coordinator | Add PYQ |
| `PUT` | `/api/v1/resources/previous-year-questions/:id` | 🔒 Coordinator | Update PYQ |
| `DELETE` | `/api/v1/resources/previous-year-questions/:id` | 🔒 Coordinator | Delete PYQ |
| `POST` | `/api/v1/resources/interview-notes` | 🔒 Coordinator | Add interview note |
| `PUT` | `/api/v1/resources/interview-notes/:id` | 🔒 Coordinator | Update interview note |
| `DELETE` | `/api/v1/resources/interview-notes/:id` | 🔒 Coordinator | Delete interview note |
| `POST` | `/api/v1/resources/cheat-sheets` | 🔒 Coordinator | Add cheat sheet |
| `POST` | `/api/v1/resources/cheat-sheets/upload` | 🔒 Coordinator | Upload cheat sheet image to Cloudinary |
| `PUT` | `/api/v1/resources/cheat-sheets/:id` | 🔒 Coordinator | Update cheat sheet |
| `DELETE` | `/api/v1/resources/cheat-sheets/:id` | 🔒 Coordinator | Delete cheat sheet |

## Career Tracking

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/career` | ✅ Bearer | List all opportunities |
| `POST` | `/api/v1/career` | 🔒 Coordinator | Publish a new opportunity |
| `PUT` | `/api/v1/career/:id` | 🔒 Coordinator | Update an opportunity |
| `DELETE` | `/api/v1/career/:id` | 🔒 Coordinator | Delete an opportunity |
| `POST` | `/api/v1/career/:id/register` | ✅ Bearer | Student registers interest |
| `DELETE` | `/api/v1/career/:id/register` | ✅ Bearer | Student withdraws registration |

> 🔒 **Coordinator** = `PLACEMENT_COORDINATOR` role required. Only one coordinator may exist in the system.
