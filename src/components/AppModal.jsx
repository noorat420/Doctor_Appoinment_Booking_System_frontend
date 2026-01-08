function AppModal({
  show,
  title,
  message,
  type = "primary",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  disableConfirm = false,
  children
}) {
  if (!show) return null;

  return (
    <>
    
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

  
      <div 
        className="modal fade show d-block" 
        tabIndex="-1"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      >
        <div 
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className={`modal-header ${type === 'danger' ? 'border-danger' : ''}`}>
              <h6 className={`modal-title mb-0 ${type === 'danger' ? 'text-danger' : ''}`}>
                {title}
              </h6>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              {message && <p className="mb-0" style={{ fontSize: '0.875rem' }}>{message}</p>}
              {children}
            </div>

            <div className="modal-footer">
              {onConfirm && (
                <button 
                  className="btn btn-outline-secondary btn-sm" 
                  onClick={onClose}
                  style={{ fontSize: '0.8rem' }}
                >
                  {cancelText}
                </button>
              )}

              <button
                className={`btn btn-${type} btn-sm`}
                onClick={onConfirm ? onConfirm : onClose}
                disabled={disableConfirm}
                style={{ fontSize: '0.8rem' }}
              >
                {confirmText || "OK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppModal;