import { useState } from "react";
import { createAvailabilitySlot } from "../../services/doctorService";

function ManageSlots() {
  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await createAvailabilitySlot(formData);
      setSuccess("Availability slot created successfully!");
      setFormData({
        date: "",
        start_time: "",
        end_time: ""
      });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create slot ❌");
    } finally {
      setLoading(false);
    }
  };
  
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="mb-4 ">
        <h1 className="h2 fw-bold mb-1">Manage Availability</h1>
        <p className="text-muted">Create time slots for patient appointments</p>
      </div>

      <div className="card " style={{ maxWidth: 800 }}>
        <div className="card-header">
          <h5 className="mb-0 p-2">Create New Slot</h5>
        </div>
        <div className="card-body">
          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="start_time" className="form-label">Start Time</label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  className="form-control"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="end_time" className="form-label">End Time</label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  className="form-control"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
              style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                  Creating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Availability Slot
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Tips Section */}
      <div className="card  mt-3" style={{ maxWidth: 800 }}>
        <div className="card-body">
          <h5 className="d-flex align-items-center gap-2 mb-3" style={{ color: '#7C3AED' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            Tips
          </h5>
          <ul className="text-muted small mb-0">
            <li className="mb-2">Create slots for times when you're available for consultations</li>
            <li className="mb-2">Patients will be able to book these slots from their dashboard</li>
            <li>You can cancel booked appointments from the Appointments page</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ManageSlots;