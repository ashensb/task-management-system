const db = require('../config/db');

// 1. Create a New Task
exports.createTask = async (req, res) => {
    const { title, description, priority, status, due_date } = req.body;

    // Backend Validations
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!priority) return res.status(400).json({ message: 'Priority is required' });
    if (!status) return res.status(400).json({ message: 'Status is required' });
    if (!due_date) return res.status(400).json({ message: 'Due Date is required' });

    // Validate due date (Cannot be earlier than today)
    const today = new Date().toISOString().split('T')[0];
    if (due_date < today) {
        return res.status(400).json({ message: 'Due date cannot be earlier than today' });
    }

    try {
        const query = `
            INSERT INTO tasks (title, description, priority, status, due_date)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [title, description || '', priority, status, due_date]);

        res.status(201).json({
            message: 'Task created successfully',
            taskId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// 2. Get All Tasks (Search, Filter, Sort)
exports.getTasks = async (req, res) => {
    const { search, status, priority, sortBy } = req.query;

    try {
        let query = 'SELECT * FROM tasks WHERE 1=1';
        let queryParams = [];

        // Search by Title
        if (search) {
            query += ' AND title LIKE ?';
            queryParams.push(`%${search}%`);
        }

        // Filter by Status
        if (status) {
            query += ' AND status = ?';
            queryParams.push(status);
        }

        // Filter by Priority
        if (priority) {
            query += ' AND priority = ?';
            queryParams.push(priority);
        }

        // Sorting Logic
        if (sortBy === 'oldest') {
            query += ' ORDER BY created_at ASC';
        } else if (sortBy === 'due_date') {
            query += ' ORDER BY due_date ASC';
        } else {
            query += ' ORDER BY created_at DESC'; // Default: Newest Created
        }

        const [tasks] = await db.query(query, queryParams);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

// 3. Get Single Task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(tasks[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
};

// 4. Update Task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, status, due_date } = req.body;

    if (!title || !priority || !status || !due_date) {
        return res.status(400).json({ message: 'Title, Priority, Status and Due Date are required' });
    }

    try {
        const query = `
            UPDATE tasks 
            SET title = ?, description = ?, priority = ?, status = ?, due_date = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [title, description || '', priority, status, due_date, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// 5. Delete Task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};

// 6. Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [total] = await db.query('SELECT COUNT(*) as count FROM tasks');
        const [pending] = await db.query('SELECT COUNT(*) as count FROM tasks WHERE status = "Pending"');
        const [inProgress] = await db.query('SELECT COUNT(*) as count FROM tasks WHERE status = "In Progress"');
        const [completed] = await db.query('SELECT COUNT(*) as count FROM tasks WHERE status = "Completed"');
        
        // Overdue: Due date past today & Status is not Completed
        const [overdue] = await db.query('SELECT COUNT(*) as count FROM tasks WHERE due_date < ? AND status != "Completed"', [today]);

        res.json({
            totalTasks: total[0].count,
            pendingTasks: pending[0].count,
            inProgressTasks: inProgress[0].count,
            completedTasks: completed[0].count,
            overdueTasks: overdue[0].count
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};