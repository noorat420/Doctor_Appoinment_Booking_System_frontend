import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getDoctorProfile, updateDoctorProfile, deleteDoctorAccount } from "../../services/doctorService";
import { logout } from "../../services/authService";

function DoctorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    designation: "",
    specialization: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const designationOptions = [
    "Dr.",
    "MBBS",
    "MD",
    "MS",
    "BDS",
    "MDS",
    "BAMS",
    "BHMS",
    "DM",
    "MCh",
    "DNB",
    "PhD"
  ];

  const specializationOptions = [
    "General Practitioner",
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Neurologist",
    "Oncologist",
    "Ophthalmologist",
    "Orthopedic Surgeon",
    "Pediatrician",
    "Psychiatrist",
    "Pulmonologist",
    "Radiologist",
    "Urologist",
    "Gynecologist",
    "ENT Specialist",
    "Dentist",
    "Physiotherapist",
    "Other"
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getDoctorProfile();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        designation: data.designation || "",
        specialization: data.specialization || ""
      });
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      await updateDoctorProfile({
        designation: profile.designation,
        specialization: profile.specialization
      });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;
    
    setDeleting(true);
    try {
      await deleteDoctorAccount();
      logout();
      navigate("/login");
      alert("Your account has been deleted successfully.");
    } catch (err) {
      setError("Failed to delete account. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  // Delete Confirmation Modal
  const DeleteModal = () => {
    if (!showDeleteModal) return null;

    return createPortal(
      <div className="custom-modal-overlay" onClick={() => setShowDeleteModal(false)}>
        <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
          <div className="custom-modal-header">
            <h2 className="custom-modal-title" style={{ color: "var(--danger)" }}>
              Delete Account
            </h2>
            <button className="custom-modal-close" onClick={() => setShowDeleteModal(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="custom-modal-body">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ 
                width: 64, 
                height: 64, 
                background: "var(--danger-bg)", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="32" height="32" style={{ color: "var(--danger)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Are you sure?</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                This action cannot be undone. This will permanently delete your account and remove all your data including appointments and availability slots.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Type <strong>DELETE</strong> to confirm
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Type DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                style={{ borderColor: confirmText === "DELETE" ? "var(--danger)" : undefined }}
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={confirmText !== "DELETE" || deleting}
                style={{ flex: 1 }}
              >
                {deleting ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                    Deleting...
                  </>
                ) : (
                  "Delete My Account"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading profile...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Update your professional information</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-header">
          <h3 className="card-title">Profile Information</h3>
        </div>
        <div className="card-body">
          {success && (
            <div className="alert alert-success" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
      
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.name}
                disabled
                style={{ backgroundColor: "#f3f4f6" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                disabled
                style={{ backgroundColor: "#f3f4f6" }}
              />
            </div>

            {/* Editable fields */}
            <div className="form-group">
              <label className="form-label">Designation</label>
              <select
                name="designation"
                className="form-control"
                value={profile.designation}
                onChange={handleChange}
              >
                <option value="">Select designation</option>
                {designationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <small style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 4, display: "block" }}>
                Your medical degree or title
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Specialization</label>
              <select
                name="specialization"
                className="form-control"
                value={profile.specialization}
                onChange={handleChange}
              >
                <option value="">Select specialization</option>
                {specializationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <small style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 4, display: "block" }}>
                Your area of medical expertise
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ width: "100%" }}
            >
              {saving ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Preview Card */}
      <div className="card" style={{ maxWidth: 600, marginTop: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Profile Preview</h3>
        </div>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="doctor-avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
              {profile.name ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "DR"}
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                Dr. {profile.name || "Your Name"}
              </h3>
              <p style={{ color: "var(--primary)", fontWeight: 500, fontSize: 13, margin: "4px 0 0 0" }}>
                {profile.designation || "Designation not set"}
              </p>
              <p style={{ color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                {profile.specialization || "Specialization not set"}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0 0" }}>
                {profile.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ maxWidth: 600, marginTop: 24, borderColor: "var(--danger)" }}>
        <div className="card-header" style={{ background: "var(--danger-bg)" }}>
          <h3 className="card-title" style={{ color: "var(--danger)" }}>Danger Zone</h3>
        </div>
        <div className="card-body">
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 16 }}>
            If you are no longer practicing, you can delete your account. This action is permanent and cannot be undone.
          </p>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete My Account
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal />
    </div>
  );
}

export default DoctorProfile;
