const express = require('express');
const os = require('os');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    console.log(`[Node Tracer] Request from ${req.ip} for ${req.url}`);
    next();
});

// ---- DYNAMIC AND INTERESTING METRICS ENDPOINT ----
app.get('/', (req, res) => {
    // 1. Calculate live resource consumption parameters
    const totalMemoryGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const freeMemoryGB = (os.freemem() / (1024 ** 3)).toFixed(2);
    const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);
    const ramUsagePercentage = ((usedMemoryGB / totalMemoryGB) * 100).toFixed(1);

    // 2. Parse operational system metrics
    const uptimeSeconds = os.uptime();
    const days = Math.floor(uptimeSeconds / (3600*24));
    const hours = Math.floor((uptimeSeconds % (3600*24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    res.json({
        status: "success",
        environment: "AWS EC2 Cloud Node Production",
        node_version: process.version,
        host_operating_system: `${os.type()} (${os.arch()} architecture)`,
        cloud_server_hostname: os.hostname(),
        
        // Live Server Health Metrics
        server_telemetry: {
            system_uptime: `${days}d ${hours}h ${minutes}m`,
            cpu_cores_available: os.cpus().length,
            cpu_model: os.cpus()[0].model,
            ram_consumption: `${usedMemoryGB} GB used / ${totalMemoryGB} GB total (${ramUsagePercentage}% active)`
        },

        // Client Network Footprint
        visitor_metadata: {
            your_perceived_ip: req.headers['x-real-ip'] || req.ip,
            request_secure_protocol: req.protocol.toUpperCase(),
            request_timestamp: new Date().toISOString()
        },
        
        message: "🚀 Your self-healing Nginx infrastructure pipeline is completely operational!"
    });
});

app.get('/api/price', (req, res) => {
    res.json({
        success: true,
        ticker: "BTC/USD",
        price: 98500.25,
        currency: "USD",
        updated_at: new Date().toISOString()
    });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", server: os.hostname(), node: process.version });
});

app.listen(PORT, () => {
    console.log(`==> Analytics engine listening internally on port ${PORT}`);
});
