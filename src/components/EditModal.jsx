import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { validateName, validateMobile, validateDepartment, ALLOWED_DEPARTMENTS } from '../utils/validators';

export function EditModal({ submission, onSave, onClose }) {
  const [fullName, setFullName] = useState(submission.fullName || '');
  const [mobile, setMobile] = useState(submission.mobile || '');
  const [department, setDepartment] = useState(submission.department || '');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setFullName(submission.fullName || '');
    setMobile(submission.mobile || '');
    setDepartment(submission.department || '');
    setErrors({});
    setTouched({});
  }, [submission]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'fullName':
        return validateName(value);
      case 'mobile':
        return validateMobile(value);
      case 'department':
        return validateDepartment(value);
      default:
        return '';
    }
  }, []);

  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const value = field === 'fullName' ? fullName : field === 'mobile' ? mobile : department;
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [fullName, mobile, department, validateField]
  );

  const handleFullNameChange = useCallback(
    (e) => {
      const value = e.target.value;
      setFullName(value);
      if (touched.fullName) {
        const error = validateField('fullName', value);
        setErrors((prev) => ({ ...prev, fullName: error }));
      }
    },
    [touched.fullName, validateField]
  );

  const handleMobileChange = useCallback(
    (e) => {
      const value = e.target.value;
      setMobile(value);
      if (touched.mobile) {
        const error = validateField('mobile', value);
        setErrors((prev) => ({ ...prev, mobile: error }));
      }
    },
    [touched.mobile, validateField]
  );

  const handleDepartmentChange = useCallback(
    (e) => {
      const value = e.target.value;
      setDepartment(value);
      setTouched((prev) => ({ ...prev, department: true }));
      const error = validateField('department', value);
      setErrors((prev) => ({ ...prev, department: error }));
    },
    [validateField]
  );

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();

      const fullNameError = validateField('fullName', fullName);
      const mobileError = validateField('mobile', mobile);
      const departmentError = validateField('department', department);

      const newErrors = {
        fullName: fullNameError,
        mobile: mobileError,
        department: departmentError,
      };

      setErrors(newErrors);
      setTouched({ fullName: true, mobile: true, department: true });

      const hasErrors = Object.values(newErrors).some((err) => err !== '');
      if (hasErrors) {
        return;
      }

      onSave(submission.id, {
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        department: department.trim(),
      });
    },
    [fullName, mobile, department, submission.id, onSave, validateField]
  );

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-content" ref={contentRef} role="dialog" aria-modal="true" aria-label="Edit Submission">
        <div className="modal-header">
          <h2>Edit Submission</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="edit-fullName">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="edit-fullName"
                type="text"
                className={`form-input ${errors.fullName && touched.fullName ? 'input-error' : touched.fullName && !errors.fullName ? 'input-success' : ''}`}
                value={fullName}
                onChange={handleFullNameChange}
                onBlur={() => handleBlur('fullName')}
                placeholder="Enter full name"
              />
              {errors.fullName && touched.fullName && (
                <p className="form-error-message">{errors.fullName}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                type="email"
                className="form-input"
                value={submission.email}
                readOnly
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              />
              <p className="form-helper-text">Email cannot be changed.</p>
            </div>

            <div className="form-group">
              <label htmlFor="edit-mobile">
                Mobile <span className="required">*</span>
              </label>
              <input
                id="edit-mobile"
                type="text"
                className={`form-input ${errors.mobile && touched.mobile ? 'input-error' : touched.mobile && !errors.mobile ? 'input-success' : ''}`}
                value={mobile}
                onChange={handleMobileChange}
                onBlur={() => handleBlur('mobile')}
                placeholder="Enter mobile number"
              />
              {errors.mobile && touched.mobile && (
                <p className="form-error-message">{errors.mobile}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-department">
                Department <span className="required">*</span>
              </label>
              <select
                id="edit-department"
                className={`form-select ${errors.department && touched.department ? 'input-error' : touched.department && !errors.department ? 'input-success' : ''}`}
                value={department}
                onChange={handleDepartmentChange}
                onBlur={() => handleBlur('department')}
              >
                <option value="">Select a department</option>
                {ALLOWED_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && touched.department && (
                <p className="form-error-message">{errors.department}</p>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    submittedAt: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditModal;