import { useEffect, useState } from "react";
import {
  getMyAppointments,
  cancelAppointment,
} from "../../services/appointmentService";
import AppModal from "../../components/AppModal";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (appointmentId) => {
    setModalData({
      title: "Cancel Appointment",
      message: "Are you sure you want to cancel this appointment?",
      type: "danger",
      confirmText: "Yes, Cancel",
      cancelText: "No",
      onConfirm: async () => {
        setShowModal(false);

        try {
          await cancelAppointment(appointmentId);

          setModalData({
            title: "Success",
            message: "Appointment cancelled successfully ✅",
            type: "success",
            confirmText: "OK",
            onConfirm: () => setShowModal(false),
          });

          setShowModal(true);
          fetchAppointments();
        } catch (err) {
          setModalData({
            title: "Error",
            message: "Failed to cancel appointment ❌",
            type: "danger",
            confirmText: "Close",
            onConfirm: () => setShowModal(false),
          });

          setShowModal(true);
        }
      },
    });

    setShowModal(true);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getInitials = (name) => {
    if (!name) return "D";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "booked":
        return <span className="badge bg-success">Booked</span>;
      case "completed":
        return <span className="badge bg-info">Completed</span>;
      case "cancelled":
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const bookedAppointments = appointments.filter((a) => a.status === "booked");
  const pastAppointments = appointments.filter((a) => a.status !== "booked");

  return (
    <div>
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-1">My Appointments</h1>
        <p className="text-muted">View and manage your appointments</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-body">
              <div
                className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-3 mb-3"
                style={{ width: 48, height: 48, color: "#7C3AED" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  width="24"
                  height="24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <h3 className="h2 fw-bold mb-0">{appointments.length}</h3>
              <p className="text-muted small mb-0">Total Appointments</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-body">
              <div
                className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-3 mb-3"
                style={{ width: 48, height: 48, color: "#10B981" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  width="24"
                  height="24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="h2 fw-bold mb-0">{bookedAppointments.length}</h3>
              <p className="text-muted small mb-0">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-body">
              <div
                className="d-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded-3 mb-3"
                style={{ width: 48, height: 48, color: "#F59E0B" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  width="24"
                  height="24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="h2 fw-bold mb-0">{pastAppointments.length}</h3>
              <p className="text-muted small mb-0">Past</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner mx-auto mb-2"></div>
          <p className="text-muted">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <div
              className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 80, height: 80 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width="40"
                height="40"
                style={{ color: "#7C3AED" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <h5>No Appointments Yet</h5>
            <p className="text-muted">
              Book your first appointment with one of our doctors.
            </p>
          </div>
        </div>
      ) : (
        <>
          {bookedAppointments.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-2 mt-2 p-2 text-center">
                  Upcoming Appointments
                </h5>
              </div>
              <div className="list-group list-group-flush">
                {bookedAppointments.map((appt) => (
                  <div key={appt.appointment_id} className="list-group-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="avatar-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0"
                          style={{ width: 48, height: 48 }}
                        >
                          {getInitials(appt.doctor_name)}
                        </div>
                        <div>
                          <h6 className="mb-1">{appt.doctor_name}</h6>
                          <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              width="14"
                              height="14"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                              />
                            </svg>
                            {appt.date} • {appt.start_time} - {appt.end_time}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {getStatusBadge(appt.status)}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(appt.appointment_id)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastAppointments.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-2 mt-2 p-2 text-center">Past Appointments</h5>
              </div>
              <div className="list-group list-group-flush">
                {pastAppointments.map((appt) => (
                  <div key={appt.appointment_id} className="list-group-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3 opacity-75">
                        <div
                          className="avatar-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0"
                          style={{ width: 48, height: 48 }}
                        >
                          {getInitials(appt.doctor_name)}
                        </div>
                        <div>
                          <h6 className="mb-1">{appt.doctor_name}</h6>
                          <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              width="14"
                              height="14"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                              />
                            </svg>
                            {appt.date} • {appt.start_time} - {appt.end_time}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(appt.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      <AppModal
        show={showModal}
        title={modalData.title}
        message={modalData.message}
        type={modalData.type}
        confirmText={modalData.confirmText}
        cancelText={modalData.cancelText}
        onConfirm={modalData.onConfirm}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default MyAppointments;
