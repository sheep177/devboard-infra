import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import type { Task, Comment, User, Project } from "../types";

export default function AdminPanel() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const [newUser, setNewUser] = useState({ username: "", password: "", role: "Member" });
    const [newProjectName, setNewProjectName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AdminPanel loaded projects:", projects);
        const fetchData = async () => {
            try {
                const [taskRes, commentRes, userRes, projectRes] = await Promise.all([
                    api.get("/tasks"),
                    api.get("/comments"),
                    api.get("/users"),
                    api.get("/projects"),
                ]);
                setTasks(taskRes.data);
                setComments(commentRes.data);
                setUsers(userRes.data);
                setProjects(projectRes.data);
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeleteTask = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        await api.delete(`/tasks/${id}`);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const handleDeleteComment = async (id: number) => {
        if (!confirm("Delete this comment?")) return;
        await api.delete(`/comments/${id}`);
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Delete this user?")) return;
        await api.delete(`/users/${id}`);
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const handleCreateUser = async () => {
        try {
            const res = await api.post("/users", newUser);
            setUsers([...users, res.data]);
            setNewUser({ username: "", password: "", role: "Member" });
        } catch (err) {
            alert("User creation failed. Username may already exist.");
        }
    };

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) {
            alert("Project name cannot be empty");
            return;
        }
        try {
            const res = await api.post(`/projects?name=${encodeURIComponent(newProjectName)}`);
            setProjects((prev) => [...prev, res.data]);
            setNewProjectName("");
        } catch (err) {
            alert("Failed to create project");
            console.error(err);
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm("Delete this project?")) return;
        try {
            await api.delete(`/projects/${id}`);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            alert("Failed to delete project");
            console.error(err);
        }
    };

    if (loading) return <p className="text-center p-8">Loading admin data...</p>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Back 按钮 */}
            <button
                onClick={() => navigate("/")}
                className="mb-6 text-sm text-blue-600 underline hover:text-blue-800"
            >
                ← Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold text-blue-600 mb-6">🛡 Admin Panel</h1>

            {/* 任务列表 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">🗂 All Tasks</h2>
                {tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-100 rounded mb-2 flex justify-between">
                        <div>
                            <strong>{task.title}</strong> - {task.status} - {task.priority}
                        </div>
                        <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </section>

            {/* 评论列表 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">💬 All Comments</h2>
                {comments.map((c) => (
                    <div key={c.id} className="p-2 bg-white rounded shadow mb-2 flex justify-between items-center">
                        <div className="text-sm">
                            <strong>User {c.userId}</strong>: {c.content}
                        </div>
                        <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-red-500 text-xs hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </section>

            {/* 用户列表 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">👥 Members</h2>
                {users.map((u) => (
                    <div key={u.id} className="flex justify-between items-center mb-2">
                        <div className="text-sm">
                            {u.username} - <span className="italic">{u.role}</span>
                        </div>
                        <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-500 text-xs hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                ))}

                <div className="mt-4 space-y-2">
                    <h3 className="text-md font-semibold">➕ Add Member</h3>
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                    >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <button
                        onClick={handleCreateUser}
                        className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
                    >
                        Create User
                    </button>
                </div>
            </section>

            {/* 项目管理部分 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">📁 Projects</h2>
                {projects.map((proj) => (
                    <div key={proj.id} className="p-3 bg-gray-100 rounded mb-2 flex justify-between items-center">
                        <span>{proj.name}</span>
                        <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                ))}

                <div className="mt-4 space-y-2">
                    <h3 className="text-md font-semibold">➕ Add Project</h3>
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                    />
                    <button
                        onClick={handleCreateProject}
                        className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 transition"
                    >
                        Create Project
                    </button>
                </div>
            </section>
        </div>
    );
}
