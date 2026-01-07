import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    invitation_code: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDoctor = formData.role === "doctor";

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    } else if (data.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (data.role === "doctor" && !data.invitation_code.trim()) {
      newErrors.invitation_code =
        "Invitation code is required for doctor registration";
    }

    return newErrors;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="28"
              height="28"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join DocAppointment today</p>
        </div>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="text-danger" style={{ fontSize: 13 }}>
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <div className="text-danger" style={{ fontSize: 13 }}>
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            {errors.password && (
              <div className="text-danger" style={{ fontSize: 13 }}>
                {errors.password}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">I am a</label>
            <select
              name="role"
              className={`form-control ${errors.role ? "is-invalid" : ""}`}
              value={formData.role}
              onChange={handleChange}
            >

              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            {errors.role && (
              <div className="text-danger" style={{ fontSize: 13 }}>
                {errors.role}
              </div>
            )}
          </div>

          {/* Doctor Invitation Code - Only shown when doctor is selected */}
          {isDoctor && (
            <div className="form-group">
              <label className="form-label">
                Doctor Invitation Code
                <span style={{ color: "var(--danger)", marginLeft: 4 }}>*</span>
              </label>
              <input
                type="text"
                name="invitation_code"
                className={`form-control ${errors.invitation_code ? "is-invalid" : ""}`}
                placeholder="Enter your invitation code"
                value={formData.invitation_code}
                onChange={handleChange}
                required
              />
              {errors.invitation_code && (
                <div className="text-danger" style={{ fontSize: 13 }}>
                  {errors.invitation_code}
                </div>
              )}
              <small
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  marginTop: 4,
                  display: "block",
                }}
              >
                Contact admin to get an invitation code for doctor registration
              </small>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  className="spinner"
                  style={{ width: 16, height: 16, borderWidth: 2 }}
                ></div>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
