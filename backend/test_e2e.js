(async () => {
  const base = 'http://localhost:5000/api';
  const log = (label, obj) => console.log('\n==== ' + label + ' ====' , JSON.stringify(obj, null, 2));

  const post = async (path, body) => {
    const res = await fetch(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  };
  const put = async (path) => {
    const res = await fetch(base + path, { method: 'PUT' });
    return res.json();
  };
  const get = async (path) => {
    const res = await fetch(base + path);
    return res.json();
  };

  try {
    // 1. Signup driver
    const drv = await post('/auth/signup', {
      name: 'Driver E2E',
      email: 'driver_e2e@example.com',
      password: 'pass123',
      phone: '9000000001',
      gender: 'male',
      office: 'Gachibowli'
    });
    log('driver signup', drv);

    // 2. Signup passenger
    const pas = await post('/auth/signup', {
      name: 'Passenger E2E',
      email: 'pass_e2e@example.com',
      password: 'pass123',
      phone: '9000000002',
      gender: 'female',
      office: 'Gachibowli'
    });
    log('passenger signup', pas);

    const driverSession = drv.sessionId;
    const passSession = pas.sessionId;

    // 3. Driver creates ride
    const now = new Date();
    const est = new Date(now.getTime() + 45 * 60000);
    const rideCreate = await post('/rides', {
      sessionId: driverSession,
      startLocation: 'Kukatpally',
      destination: 'Gachibowli',
      viaRoute: 'Via Miyapur',
      office: 'Gachibowli',
      time: now.toTimeString().slice(0,5),
      date: now.toISOString().split('T')[0],
      availableSeats: 2,
      startTime: now.toISOString(),
      estimatedDropTime: est.toISOString()
    });
    log('ride created', rideCreate);
    const rideId = rideCreate.ride.id;

    // 4. Passenger requests
    const reqCreate = await post('/requests', {
      sessionId: passSession,
      rideId,
      message: 'Hi, may I join?'
    });
    log('request created', reqCreate);
    const requestId = reqCreate.request.id;

    // 5. Driver accepts
    const accept = await fetch(`${base}/requests/${requestId}/accept?sessionId=${driverSession}`, { method: 'PUT' }).then(r => r.json());
    log('accept response', accept);

    // 6. Driver marks reached
    const reached = await fetch(`${base}/requests/${requestId}/reached?sessionId=${driverSession}`, { method: 'PUT' }).then(r => r.json());
    log('reached response', reached);

    // 7. Fetch final states
    const rideState = await get(`/rides/${rideId}`);
    log('ride state', rideState);

    const passengerRequests = await get(`/requests?sessionId=${passSession}`);
    log('passenger requests', passengerRequests);

    const driverRequests = await get(`/requests?sessionId=${driverSession}`);
    log('driver requests', driverRequests);

    console.log('\nE2E script finished');
  } catch (err) {
    console.error('E2E script error', err);
    process.exit(1);
  }
})();
