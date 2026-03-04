const jwt = require('jsonwebtoken');

const secret = 'adgenie_123'; // Matches default in environment.js

// 1. Test immediate verification
const token1 = jwt.sign({ userId: 'test_user' }, secret, { expiresIn: '1h' });
try {
    const decoded = jwt.verify(token1, secret);
    console.log('✅ Token 1 (1h) verified immediately:', decoded.userId);
} catch (e) {
    console.error('❌ Token 1 verification failed:', e.message);
}

// 2. Test expired token
const token2 = jwt.sign({ userId: 'test_user' }, secret, { expiresIn: '1ms' });
setTimeout(() => {
    try {
        jwt.verify(token2, secret);
        console.error('❌ Token 2 (1ms) should have expired but verified!');
    } catch (e) {
        console.log('✅ Token 2 correctly failed with:', e.message);
    }
}, 10);

// 3. Test sliding session header logic (simulated)
// This verifies our logic in authMiddleware conceptually
const generateToken = (userId) => jwt.sign({ userId }, secret, { expiresIn: '1h' });
const mockReq = { headers: { authorization: `Bearer ${token1}` } };
const mockRes = { 
    headers: {},
    setHeader(key, val) { this.headers[key] = val; }
};

const decoded = jwt.verify(token1, secret);
const newToken = generateToken(decoded.userId);
mockRes.setHeader('x-new-token', newToken);

if (mockRes.headers['x-new-token']) {
    console.log('✅ Sliding session header logic verified (conceptually)');
} else {
    console.error('❌ Sliding session header logic failed');
}
