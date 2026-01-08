import { useEffect, useState } from "react";
import {
  getDoctorAppointments,
  cancelAppointment,
} from "../../services/appointmentService";
import AppModal from "../../components/AppModal";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getDoctorAppointments();
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
    if (!name) return "P";
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
        <h1 className="h2 fw-bold mb-1">Appointments</h1>
        <p className="text-muted">Manage your patient appointments</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner mx-auto mb-2"></div>
          <p className="text-muted">Loading appointments...</p>
        </div>
      ) : (
        <>
          {bookedAppointments.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="text-center mb-0">Upcoming Appointments</h5>
              </div>

              <div className="list-group list-group-flush">
                {bookedAppointments.map((appt) => (
                  <div key={appt.appointment_id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle avatar-gradient text-white d-flex align-items-center justify-content-center"
                          style={{ width: 48, height: 48 }}
                        >
                          {getInitials(appt.patient_name)}
                        </div>

                        <div>
                          <h6 className="mb-1">{appt.patient_name}</h6>
                          <p className="text-muted small mb-0">
                            {appt.date} • {appt.start_time} - {appt.end_time}
                          </p>
                        </div>
                      </div>

                      <div className="d-flex gap-2 align-items-center">
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
            <div className="card">
              <div className="card-header">
                <h5 className="text-center mb-0">Past Appointments</h5>
              </div>

              <div className="list-group list-group-flush">
                {pastAppointments.map((appt) => (
                  <div key={appt.appointment_id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center opacity-75">
                      <div>
                        <h6 className="mb-1">{appt.patient_name}</h6>
                        <p className="text-muted small mb-0">
                          {appt.date} • {appt.start_time} - {appt.end_time}
                        </p>
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

export default DoctorAppointments;
