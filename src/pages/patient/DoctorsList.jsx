import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getDoctors, getDoctorAvailability } from "../../services/patientService";
import { bookAppointment } from "../../services/appointmentService";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSlot, setBookingSlot] = useState(null);

  const fetchDoctors = async (pageNumber) => {
    setLoading(true);
    try {
      const { data, page: currentPage, totalPages: total } = await getDoctors(pageNumber);
      setDoctors(data);
      setTotalPages(total);
      setPage(currentPage);
    } catch (err) {
      console.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const openSlotsModal = async (doctor) => {
    setSelectedDoctor(doctor);
    setSlots([]);
    setLoadingSlots(true);
    
    try {
      const data = await getDoctorAvailability(doctor.id);
      setSlots(data || []);
    } catch (err) {
      console.error("Failed to load availability:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setSlots([]);
  };

  const handleBookSlot = async (slotId) => {
    setBookingSlot(slotId);
    try {
      await bookAppointment(slotId);
      alert("Appointment booked successfully! ✅");
      closeModal();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This slot is already booked ❌");
      } else {
        alert("Booking failed ❌");
      }
    } finally {
      setBookingSlot(null);
    }
  };

  useEffect(() => {
    fetchDoctors(1);
  }, []);

  const getInitials = (name) => {
    if (!name) return "D";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Modal component using Portal
  const Modal = () => {
    if (!selectedDoctor) return null;
    
    return createPortal(
      <div className="custom-modal-overlay" onClick={closeModal}>
        <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
          <div className="custom-modal-header">
            <h2 className="custom-modal-title">
              Book with Dr. {selectedDoctor.name}
            </h2>
            <button className="custom-modal-close" onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="custom-modal-body">
            {loadingSlots ? (
              <div className="loading">
                <div className="spinner"></div>
                Loading available slots...
              </div>
            ) : slots.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="40" height="40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3>No Available Slots</h3>
                <p>This doctor has no available slots at the moment.</p>
              </div>
            ) : (
              <div className="slots-grid">
                {slots.map((slot) => (
                  <div
                    key={slot.slot_id}
                    className="slot-card"
                    onClick={() => handleBookSlot(slot.slot_id)}
                    style={{ 
                      opacity: bookingSlot === slot.slot_id ? 0.7 : 1,
                      cursor: bookingSlot ? "wait" : "pointer"
                    }}
                  >
                    <div className="slot-date">{slot.date}</div>
                    <div className="slot-time">{slot.start_time} - {slot.end_time}</div>
                    {bookingSlot === slot.slot_id && (
                      <div style={{ fontSize: 12, marginTop: 8 }}>Booking...</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Find Doctors</h1>
          <p className="page-subtitle">Browse our doctors and book an appointment</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading doctors...
        </div>
      ) : doctors.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="40" height="40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3>No Doctors Available</h3>
            <p>Please check back later for available doctors.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="doctors-grid">
            {doctors.map((doc) => (
              <div key={doc.id} className="doctor-card">
                <div className="doctor-card-header">
                  <div className="doctor-avatar">
                    {getInitials(doc.name)}
                  </div>
                  <div className="doctor-info">
                    <h4>Dr. {doc.name}</h4>
                    {doc.designation && (
                      <p style={{ color: "var(--primary)", fontWeight: 500, fontSize: 13 }}>{doc.designation}</p>
                    )}
                    <p>{doc.specialization || "General Practitioner"}</p>
                  </div>
                </div>
                <div className="doctor-card-footer">
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    onClick={() => openSlotsModal(doc)}
                  >
                    View Available Slots
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => fetchDoctors(page - 1)}
              >
                ←
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => fetchDoctors(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => fetchDoctors(page + 1)}
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal rendered via Portal */}
      <Modal />
    </div>
  );
}

export default DoctorsList;
