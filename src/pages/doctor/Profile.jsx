import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorProfile, updateDoctorProfile, deleteDoctorAccount } from "../../services/doctorService";
import { logout } from "../../services/authService";
import AppModal from "../../components/AppModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const designationOptions = [
    "Dr.", "MBBS", "MD", "MS", "BDS", "MDS", "BAMS", "BHMS", "DM", "MCh", "DNB", "PhD"
  ];

  const specializationOptions = [
    "General Practitioner", "Cardiologist", "Dermatologist", "Endocrinologist",
    "Gastroenterologist", "Neurologist", "Oncologist", "Ophthalmologist",
    "Orthopedic Surgeon", "Pediatrician", "Psychiatrist", "Pulmonologist",
    "Radiologist", "Urologist", "Gynecologist", "ENT Specialist", "Dentist",
    "Physiotherapist", "Other"
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

  const openDeleteModal = () => {
    setConfirmText("");
    setError("");
    setShowDeleteModal(true);
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE"){
      setError("Please type DELETE to confirm.");
      return;
    }
    
    setDeleting(true);
    setError("");
    try {
      await deleteDoctorAccount();
      logout();
      navigate("/login", { replace: true });
      setTimeout(() => {
        alert("Your account has been deleted successfully.");
      }, 500);
    } catch (err) {
      console.error(err);
      setError("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner mx-auto mb-2"></div>
        <p className="text-muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <h1 className="h3 fw-bold mb-1">My Profile</h1>
        <p className="text-muted small">Update your professional information</p>
      </div>

      {/* Preview Card */}
      <div className="card  mt-3" style={{ maxWidth: 600 }}>
        <div className="card-header py-2">
          <h6 className="mb-0">Profile Preview</h6>
        </div>
        <div className="card-body p-3">
          <div className="d-flex align-items-center gap-2">
            <div className="avatar-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0" style={{ width: 56, height: 56, fontSize: '1.2rem' }}>
              {profile.name ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "DR"}
            </div>
            <div>
              <h6 className="mb-1" style={{ fontSize: '0.95rem' }}>Dr. {profile.name || "Your Name"}</h6>
              <p className="text-primary fw-medium mb-1" style={{ color: '#7C3AED', fontSize: '0.75rem' }}>
                {profile.designation || "Designation not set"}
              </p>
              <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                {profile.specialization || "Specialization not set"}
              </p>
              <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>
                {profile.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card  mt-3" style={{ maxWidth: 600 }}>
        <div className="card-header py-2">
          <h6 className="mb-0">Profile Information</h6>
        </div>
        <div className="card-body p-3">
          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={profile.name}
                disabled
                style={{ backgroundColor: "#f3f4f6" }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={profile.email}
                disabled
                style={{ backgroundColor: "#f3f4f6" }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="designation" className="form-label">Designation</label>
              <select
                id="designation"
                name="designation"
                className="form-select"
                value={profile.designation}
                onChange={handleChange}
              >
                <option value="">Select designation</option>
                {designationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <small className="form-text text-muted">
                Your medical degree or title
              </small>
            </div>

            <div className="mb-3">
              <label htmlFor="specialization" className="form-label">Specialization</label>
              <select
                id="specialization"
                name="specialization"
                className="form-select"
                value={profile.specialization}
                onChange={handleChange}
              >
                <option value="">Select specialization</option>
                {specializationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <small className="form-text text-muted">
                Your area of medical expertise
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={saving}
              style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
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

      {/* Danger Zone */}
      <div className="card mt-3 border-danger" style={{ maxWidth: 600 }}>
        <div className="card-header bg-danger bg-opacity-10 border-danger py-2">
          <h6 className="mb-0 text-danger">Danger Zone</h6>
        </div>
        <div className="card-body p-3">
          <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>
            If you are no longer practicing, you can delete your account. This action is permanent and cannot be undone.
          </p>
          <button
            type="button"
            className="btn btn-danger btn-sm d-flex align-items-center gap-2"
            onClick={openDeleteModal}
            style={{ fontSize: '0.8rem' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete My Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AppModal
        show={showDeleteModal}
        title="Delete Account"
        message="This action cannot be undone. This will permanently delete your account and remove all your data including appointments and availability slots."
        type="danger"
        confirmText={deleting ? "Deleting..." : "Delete My Account"}
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        onClose={() => {
          if (!deleting) {
            setShowDeleteModal(false);
            setConfirmText("");
            setError("");
          }}}
        disableConfirm={confirmText !== "DELETE" || deleting}
      >
        <div className="mt-3">
          <div className="text-center mb-3">
            <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="32" height="32" className="text-danger">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h6 className="fw-bold mb-2">Are you sure?</h6>
          </div>
          
          <label htmlFor="confirmDelete" className="form-label small">
            Type <strong>DELETE</strong> to confirm
          </label>
          <input
            type="text"
            id="confirmDelete"
            className={`form-control ${confirmText === "DELETE" ? 'border-danger' : ''}`}
            placeholder="Type DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>
      </AppModal>
    </div>
  );
}

export default DoctorProfile;