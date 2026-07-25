import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f6f9",
      }}
    >
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          width: "100%",
          padding: "20px",
        }}
      >
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default Layout;