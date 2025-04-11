const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json({ strict: true })); // Reject malformed JSON

// ===== Redis Setup =====
const client = redis.createClient({
  url: 'redis://10.0.0.78:3001', // local machine
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 5000)
  }
});

client.on('error', (err) => console.error('Redis Error:', err));

// ===== Request Validation =====
const validateTodoArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.todos && Array.isArray(data.todos)) return data.todos;
  return null;
};

// ===== Routes =====
app.get('/', (req, res) => {
  res.json({
    status: 'API Ready',
    endpoints: {
      load: { method: 'GET', path: '/load' },
      save: {
        method: 'POST',
        path: '/save',
        bodyFormats: [
          '["todo1","todo2"]',
          '{ "todos": ["todo1","todo2"] }'
        ]
      },
      clear: { method: 'GET', path: '/clear' }
    }
  });
});

app.get('/load', async (req, res) => {
  try {
    const data = await client.get('todos');
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    console.error('Load Error:', err);
    res.status(500).json({ 
      error: 'Failed to load todos',
      solution: 'Check Redis connection'
    });
  }
});

app.post('/save', async (req, res) => {
  try {
    console.log('Raw Request Body:', req.body);
    
    const todos = validateTodoArray(req.body);
    if (!todos) {
      return res.status(400).json({
        error: 'Invalid data format',
        accepted_formats: [
          { example: ['Buy milk', 'Call mom'] },
          { example: { todos: ['Buy milk', 'Call mom'] } }
        ],
        received: req.body
      });
    }

    await client.set('todos', JSON.stringify(todos));
    res.json({ 
      status: 'success',
      saved: todos,
      redis_status: await client.ping()
    });
  } catch (err) {
    console.error('Save Error:', err);
    res.status(500).json({
      error: 'Save failed',
      redis_connected: client.isOpen,
      solution: 'Ensure Redis is running on port 6379'
    });
  }
});

app.get('/clear', async (req, res) => {
  try {
    await client.set('todos', JSON.stringify([]));
    res.json({ 
      status: 'cleared',
      redis_status: await client.ping() 
    });
  } catch (err) {
    res.status(500).json({
      error: 'Clear failed',
      redis_connected: client.isOpen
    });
  }
});

// ===== Server Start =====
async function startServer() {
  try {
    await client.connect();
    console.log('✅ Redis connection established');
    
    // Initialize empty todos if not exists
    if (!await client.exists('todos')) {
      await client.set('todos', JSON.stringify([]));
    }

    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`
       Server ready at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    process.exit(1);
  }
}

startServer();