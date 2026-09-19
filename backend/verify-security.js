require('dotenv').config();
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:5000/api/v1';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function createToken(roles) {
  return jwt.sign({ userId: 'test-user-id', email: 'test@example.com', roles }, JWT_SECRET, { expiresIn: '1h' });
}

async function request(method, path, token, body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  if (body && !(body instanceof FormData)) {
    body = JSON.stringify(body);
    options.headers['Content-Type'] = 'application/json';
  }
  
  if (body) {
    options.body = body;
  }

  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json().catch(() => null);
  
  return {
    status: res.status,
    data
  };
}

async function verifyMentorshipRoles() {
  console.log('\n--- Verifying Mentorship Roles ---');
  const payload = { title: 'Engineer', company: 'Test Corp', skills: ['Node'], bio: 'Hello' };
  
  // Student
  const studentToken = createToken(['STUDENT']);
  let res = await request('POST', '/mentors/profile', studentToken, payload);
  console.log(`Student creates profile: Expected 403, Got ${res.status}`);
  if (res.status !== 403) throw new Error('Student should not be able to create mentor profile');

  // Mentor
  const mentorToken = createToken(['MENTOR']);
  res = await request('POST', '/mentors/profile', mentorToken, payload);
  console.log(`Mentor creates profile: Expected 200/201/500, Got ${res.status}`);
  if (res.status === 401 || res.status === 403) throw new Error('Mentor should be authorized (got 401/403)');

  // Placement Coordinator
  const pcToken = createToken(['PLACEMENT_COORDINATOR']);
  res = await request('POST', '/mentors/profile', pcToken, payload);
  console.log(`Placement Coordinator creates profile: Expected 200/201/500, Got ${res.status}`);
  if (res.status === 401 || res.status === 403) throw new Error('PC should be authorized (got 401/403)');
}

async function verifyUploads() {
  console.log('\n--- Verifying Image Upload Constraints ---');
  const pcToken = createToken(['PLACEMENT_COORDINATOR']);
  
  // 1. Valid Image (JPEG < 5MB)
  const validForm = new FormData();
  validForm.append('bannerImage', new Blob([new Uint8Array(1024)]), 'valid.jpg');
  // Need a hack to set the correct type on the blob if doing this for multer.
  // We can just create a real Blob with proper type
  const validBlob = new Blob([new Uint8Array(1024)], { type: 'image/jpeg' });
  const validForm2 = new FormData();
  validForm2.append('bannerImage', validBlob, 'valid.jpg');
  
  let res = await request('POST', '/events', pcToken, validForm2);
  console.log(`Valid JPEG upload: Status ${res.status} - Error: ${res.data?.error}`);
  if (res.data?.error === 'File too large' || res.data?.error?.includes('Invalid file type')) {
      throw new Error('Valid file was rejected');
  }

  // 2. Oversized Image (6MB)
  const oversizedBlob = new Blob([new Uint8Array(6 * 1024 * 1024)], { type: 'image/jpeg' });
  const oversizedForm = new FormData();
  oversizedForm.append('bannerImage', oversizedBlob, 'large.jpg');
  res = await request('POST', '/events', pcToken, oversizedForm);
  console.log(`Oversized upload (6MB): Expected 400 (File too large), Got ${res.status} - Data:`, res.data);
  if (res.status !== 500 && res.status !== 400) throw new Error('Oversized file was not rejected properly');

  // 3. Unsupported MIME Type (PDF)
  const invalidMimeBlob = new Blob([new Uint8Array(1024)], { type: 'application/pdf' });
  const invalidMimeForm = new FormData();
  invalidMimeForm.append('bannerImage', invalidMimeBlob, 'document.pdf');
  res = await request('POST', '/events', pcToken, invalidMimeForm);
  console.log(`Unsupported MIME upload (PDF): Expected 400 (Invalid file type), Got ${res.status} - Error: ${res.data?.error}`);
  if (res.status !== 400 || !res.data?.error?.includes('Invalid file type')) throw new Error('Unsupported MIME type was not rejected properly');
}

async function verifyErrorMasking() {
  console.log('\n--- Verifying 500 Error Masking ---');
  const token = createToken(['STUDENT']);
  const res = await request('GET', '/events/invalid-uuid', token);
  console.log(`Requesting invalid ID: Status ${res.status}, Response:`, res.data);
  if (res.data?.error && JSON.stringify(res.data.error).includes('Prisma')) {
    throw new Error('Prisma error exposed to client!');
  }
}

async function main() {
  try {
    await verifyMentorshipRoles();
    await verifyUploads();
    await verifyErrorMasking();
    console.log('\nAll security verifications passed.');
  } catch (err) {
    console.error('\nVerification Failed:', err.message);
    process.exit(1);
  }
}

main();
