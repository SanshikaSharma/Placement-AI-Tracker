import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfileForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5001/api/profile/create",
        formData
      );

      if (res.data.success) {
        setMsg("Profile Created Successfully ✅");
        setFormData({ name: "", email: "" });
      } else {
        setMsg("Failed ❌");
      }
    } catch (error) {
      console.log(error);
      setMsg("Server Error ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />
        <br /><br />

     <button type="submit">
  Create Profile
</button>

<button
  type="button"
  onClick={() => navigate("/dashboard")}
  style={{
    marginLeft: "10px",
    padding: "8px 15px",
  }}
>
  Go To Dashboard
</button>
      </form>

      <p>{msg}</p>
    </div>
  );
};

export default ProfileForm;