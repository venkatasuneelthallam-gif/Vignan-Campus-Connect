const http = require('http');
const { spawn } = require('child_process');

console.log('[Verification] Starting VignanConnect server on port 5000...');
const server = spawn('node', ['server.js'], { cwd: __dirname });

server.stdout.on('data', (d) => process.stdout.write(d.toString()));
server.stderr.on('data', (d) => process.stderr.write(d.toString()));

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const postData = options.body
      ? typeof options.body === 'string'
        ? options.body
        : JSON.stringify(options.body)
      : null;

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path,
        method: options.method || 'GET',
        headers: {
          Accept: 'application/json',
          ...(postData
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
              }
            : {}),
          ...(options.headers || {})
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = body ? JSON.parse(body) : null;
          } catch (e) {
            parsed = body;
          }
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        });
      }
    );

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  console.log('[Verification] Waiting 3.5s for server initialization...');
  await new Promise((r) => setTimeout(r, 3500));

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  try {
    // 1. Health check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.status === 'online', '1. Server Health Check returns 200 JSON');

    // 2. Bad complaint validation (empty fields)
    const badComplaint = await request('/api/complaints', {
      method: 'POST',
      body: { title: '', location: '', description: '' }
    });
    assert(
      badComplaint.status === 400 &&
        badComplaint.data &&
        badComplaint.data.success === false &&
        typeof badComplaint.data.message === 'string',
      '2. Submitting empty complaint returns structured 400 JSON error (no unexpected EOF)'
    );

    // 3. Valid complaint submission
    const newComplaint = await request('/api/complaints', {
      method: 'POST',
      body: {
        title: 'Projector HDMI Flicker in Visvesvaraya Block 304',
        category: 'IT & AV Equipment',
        location: 'Visvesvaraya Block (V-Block), Room 304',
        description: 'Screen keeps going black every 3 minutes during lectures.',
        studentName: 'Pavan Kumar Reddy',
        studentEmail: '221fa04108@vignan.ac.in',
        priority: 'High'
      }
    });
    assert(
      newComplaint.status === 201 &&
        newComplaint.data &&
        newComplaint.data.success === true &&
        newComplaint.data.data &&
        newComplaint.data.data._id,
      '3. Submitting valid complaint returns 201 JSON with created record'
    );
    const complaintId = newComplaint.data?.data?._id;

    // 4. Update complaint status
    if (complaintId) {
      const updated = await request(`/api/complaints/${complaintId}`, {
        method: 'PATCH',
        body: {
          status: 'Resolved',
          adminNotes: 'Replaced high-speed HDMI cord and verified projector signal.'
        }
      });
      assert(
        updated.status === 200 && updated.data?.data?.status === 'Resolved',
        '4. Updating complaint status to Resolved returns 200 JSON'
      );
    }

    // 5. Post Lost Item
    const newLostItem = await request('/api/lost-items', {
      method: 'POST',
      body: {
        itemName: 'Scientific Calculator Casio fx-991EX',
        type: 'Lost',
        category: 'Electronics',
        location: 'Aryabhata Block (A-Block) Room 204',
        description: 'Lost on front row bench during CSE math lecture.',
        contact: '221fa04108@vignan.ac.in',
        postedBy: 'Pavan Kumar Reddy'
      }
    });
    assert(
      newLostItem.status === 201 && newLostItem.data?.success === true,
      '5. Creating Lost & Found item returns 201 JSON'
    );
    const lostItemId = newLostItem.data?.data?._id;

    // 6. Mark Lost Item Claimed
    if (lostItemId) {
      const claimed = await request(`/api/lost-items/${lostItemId}`, {
        method: 'PATCH',
        body: { status: 'Claimed' }
      });
      assert(
        claimed.status === 200 && claimed.data?.data?.status === 'Claimed',
        '6. Marking Lost Item Claimed returns 200 JSON'
      );
    }

    // 7. Post Announcement
    const newAnn = await request('/api/announcements', {
      method: 'POST',
      body: {
        title: 'Vignan Mahotsav 2026: Exhibition Hall Layout',
        message: 'Hall layout map is posted at NTR Vignan Vihar.',
        category: 'Events',
        priority: 'Important',
        postedBy: 'Dean of Student Affairs - VFSTR'
      }
    });
    assert(
      newAnn.status === 201 && newAnn.data?.success === true,
      '7. Broadcasting Announcement returns 201 JSON'
    );

    // 8. Dynamic Dashboard & Campus Pulse Stats
    const stats = await request('/api/dashboard/stats');
    assert(
      stats.status === 200 &&
        typeof stats.data?.data?.totalComplaints === 'number' &&
        typeof stats.data?.data?.resolutionRate === 'number' &&
        Array.isArray(stats.data?.data?.topCategories),
      '8. Dynamic Campus Pulse stats returned successfully'
    );

    // 9. Reset Demo Data
    const reset = await request('/api/seed/reset', { method: 'POST' });
    assert(
      reset.status === 200 && reset.data?.success === true,
      '9. Reseeding demo database returns 200 JSON'
    );

    // 10. Frontend static serving
    const frontend = await request('/');
    assert(
      frontend.status === 200 &&
        typeof frontend.raw === 'string' &&
        frontend.raw.includes('<!DOCTYPE html>'),
      '10. Frontend static HTML served at root'
    );

    // 11. Authentication: Student Login
    const authLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: '221fa04108@vignan.ac.in', password: 'vignan123' }
    });
    assert(
      authLogin.status === 200 &&
        authLogin.data?.success === true &&
        Boolean(authLogin.data?.data?.token) &&
        authLogin.data?.data?.user?.role === 'student',
      '11. Auth Login returns 200, JWT token, and student profile'
    );

    // 12. Authentication: User Registration
    const testEmail = 'verify_' + Date.now() + '@vignan.ac.in';
    const authReg = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Exhibition Verification User',
        email: testEmail,
        password: 'password123',
        role: 'student',
        studentId: '221FA09999',
        department: 'Computer Science & Engineering (CSE)'
      }
    });
    assert(
      authReg.status === 201 &&
        authReg.data?.success === true &&
        Boolean(authReg.data?.data?.token) &&
        authReg.data?.data?.user?.email === testEmail,
      '12. Auth Register returns 201, JWT token, and persists new user'
    );

    console.log(`\n========================================`);
    console.log(`RESULTS: ${passed}/${total} TESTS PASSED`);
    console.log(`========================================`);
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}

run();

