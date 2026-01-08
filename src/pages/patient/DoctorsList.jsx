import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getDoctors, getDoctorAvailability } from "../../services/patientService";
import { bookAppointment } from "../../services/appointmentService";
import AppModal from "../../components/AppModal";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

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

  const Modal = () => {
    if (!selectedDoctor) return null;
    
    return createPortal(
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeModal}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Book with Dr. {selectedDoctor.name}</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              {loadingSlots ? (
                <div className="text-center py-5">
                  <div className="spinner mx-auto mb-2"></div>
                  <p className="text-muted">Loading available slots...</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-5">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="40" height="40" style={{ color: '#7C3AED' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h5>No Available Slots</h5>
                  <p className="text-muted">This doctor has no available slots at the moment.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {slots.map((slot) => (
                    <div key={slot.slot_id} className="col-12 col-md-6">
                      <div
                        className="slot-card"
                        onClick={() => handleBookSlot(slot.slot_id)}
                        style={{ 
                          opacity: bookingSlot === slot.slot_id ? 0.7 : 1,
                          cursor: bookingSlot ? "wait" : "pointer"
                        }}
                      >
                        <div className="fw-semibold">{slot.date}</div>
                        <div className="text-muted small">{slot.start_time} - {slot.end_time}</div>
                        {bookingSlot === slot.slot_id && (
                          <div className="small mt-2">Booking...</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-1">Find Doctors</h1>
        <p className="text-muted">Browse our doctors and book an appointment</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner mx-auto mb-2"></div>
          <p className="text-muted">Loading doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80 }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="40" height="40" style={{ color: '#7C3AED' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h5>No Doctors Available</h5>
            <p className="text-muted">Please check back later for available doctors.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-3">
            {doctors.map((doc) => (
              <div key={doc.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 card-hover">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="avatar-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0" style={{ width: 56, height: 56, fontSize: '20px' }}>
                        {getInitials(doc.name)}
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <h5 className="mb-1">Dr. {doc.name}</h5>
                        {doc.designation && (
                          <p className="text-primary fw-medium small mb-1">{doc.designation}</p>
                        )}
                        <p className="text-muted small mb-0">{doc.specialization || "General Practitioner"}</p>
                      </div>
                    </div>
                    <button 
                      className="btn avatar-gradient w-100 text-white"
                      onClick={() => openSlotsModal(doc)}
                    >
                      View Available Slots
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => fetchDoctors(page - 1)}>
                    ←
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => fetchDoctors(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => fetchDoctors(page + 1)}>
                    →
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      <Modal />
    </div>
  );
}

export default DoctorsList;