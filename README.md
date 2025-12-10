<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>

<header>
  <h1>VES_Projekt – Temperature Monitoring System</h1>
  <p>Distributed Embedded Systems Project – University of Rostock</p>
</header>

<main>

<section>
  <h2>Overview</h2>
  <p>This project was built as part of the <strong>Distributed Embedded Systems (Verteilte Eingebettete Systeme)</strong> course in the Master’s Information Technology program at the University of Rostock. It implements a distributed temperature‑monitoring system consisting of sensor nodes, MQTT communication, backend logic, and a frontend displaying real-time temperature data.</p>
</section>

<section>
  <h2>System Architecture</h2>
  <div class="architecture">
    <div class="node">Raspberry Pi <br><small>Python publisher</small></div>
    <div class="arrow">➡</div>
    <div class="node">HiveMQ Broker <br><small>MQTT over TLS</small></div>
    <div class="arrow">➡</div>
    <div class="node">Node.js Backend <br><small>MQTT subscriber + WebSocket</small></div>
    <div class="arrow">➡</div>
    <div class="node">React Frontend <br><small>WebSocket client + Chart.js</small></div>
  </div>
  <p style="margin-top:0.5rem; font-size:0.9rem; color:#4a5568;">All MQTT communication is secured using TLS to ensure encrypted data transmission.</p>
</section>
<section>
  <h2>Technologies Used</h2>
  <ul>
    <li><strong>Python</strong> – sensor / publisher scripts</li>
    <li><strong>MQTT</strong> – message protocol</li>
    <li><strong>Node.js</strong> – backend (MQTT subscriber + WebSocket server)</li>
    <li><strong>WebSocket</strong> – real-time communication</li>
    <li><strong>React.js</strong> – frontend UI</li>
    <li><strong>Chart.js</strong> – charting library for real-time visualization</li>
  </ul>
</section>
<section>
  <h2>Features</h2>
  <ul>
    <li>Real-time temperature monitoring</li>
    <li>Secure communication with MQTT over TLS (HiveMQ broker)</li>
    <li>Distributed architecture: sensor → MQTT → backend → frontend</li>
    <li>Interactive live chart visualization</li>
    <li>Modular and extendable system</li>
  </ul>
</section>
<section>
  <h2>Future Improvements</h2>
  <ul>
    <li>Database storage for historical data</li>
    <li>Support multiple sensors simultaneously</li>
    <li>Add authentication for MQTT / WebSocket</li>
    <li>Extend frontend with configuration options</li>
    <li>Add more sensor types (humidity, pressure, etc.)</li>
  </ul>
</section>

</main>

</body>
</html>
