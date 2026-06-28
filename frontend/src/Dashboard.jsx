function Dashboard({ onLogout }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <p>Welcome! You are logged in successfully 🎉</p>

      <button onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;