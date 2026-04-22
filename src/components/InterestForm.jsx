import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { validateName, validateEmail, validateMobile, validateDepartment, ALLOWED_DEPARTMENTS } from '../utils/validators.js';
import { addSubmission, isEmailDuplicate } from '../utils/storage.js';

const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

const INITIAL_ERRORS_STATE = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

export function InterestForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState(INITIAL_ERRORS_STATE);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  }, []);

  const validateAllFields = useCallback(() => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile),
      department: validateDepartment(formData.department),
    };

    if (!newErrors.email && isEmailDuplicate(formData.email.trim())) {
      newErrors.email = 'This email has already been submitted';
    }

    setErrors(newErrors);

    return !newErrors.fullName && !newErrors.email && !newErrors.mobile && !newErrors.department;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSuccessMessage('');
    setSubmitError('');

    const isValid = validateAllFields();
    if (!isValid) {
      return;
    }

    const result = addSubmission({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      department: formData.department.trim(),
    });

    if (result.success) {
      setFormData(INITIAL_FORM_STATE);
      setErrors(INITIAL_ERRORS_STATE);
      setSuccessMessage('Your application has been submitted successfully!');
    } else {
      if (result.error === 'Duplicate email') {
        setErrors((prev) => ({ ...prev, email: 'This email has already been submitted' }));
      } else {
        setSubmitError(result.error || 'An unexpected error occurred. Please try again.');
      }
    }
  }, [formData, validateAllFields]);

  return (
    <div className="form-section">
      <h2>Express Your Interest</h2>
      <p className="form-subtitle">
        Fill out the form below to apply. We will get back to you shortly.
      </p>

      {successMessage && (
        <div className="banner banner-success" role="alert">
          <span className="banner-icon">✓</span>
          <span className="banner-message">{successMessage}</span>
          <button
            type="button"
            className="banner-dismiss"
            onClick={() => setSuccessMessage('')}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}

      {submitError && (
        <div className="banner banner-error" role="alert">
          <span className="banner-icon">✕</span>
          <span className="banner-message">{submitError}</span>
          <button
            type="button"
            className="banner-dismiss"
            onClick={() => setSubmitError('')}
            aria-label="Dismiss error message"
          >
            ×
          </button>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`form-input ${errors.fullName ? 'input-error' : formData.fullName ? 'input-success' : ''}`}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              autoComplete="name"
            />
            {errors.fullName && (
              <p className="form-error-message" id="fullName-error" role="alert">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'input-error' : formData.email ? 'input-success' : ''}`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <p className="form-error-message" id="email-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">
              Mobile Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className={`form-input ${errors.mobile ? 'input-error' : formData.mobile ? 'input-success' : ''}`}
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.mobile}
              aria-describedby={errors.mobile ? 'mobile-error' : 'mobile-helper'}
              autoComplete="tel"
            />
            {errors.mobile ? (
              <p className="form-error-message" id="mobile-error" role="alert">
                {errors.mobile}
              </p>
            ) : (
              <p className="form-helper-text" id="mobile-helper">
                Enter 10–15 digits, numbers only
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="department">
              Department of Interest <span className="required">*</span>
            </label>
            <select
              id="department"
              name="department"
              className={`form-select ${errors.department ? 'input-error' : formData.department ? 'input-success' : ''}`}
              value={formData.department}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.department}
              aria-describedby={errors.department ? 'department-error' : undefined}
            >
              <option value="">Select a department</option>
              {ALLOWED_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="form-error-message" id="department-error" role="alert">
                {errors.department}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Submit Application
          </button>
        </form>
      </div>

      <div className="text-center" style={{ marginTop: 'var(--spacing-xl)' }}>
        <Link to="/" className="btn btn-ghost">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default InterestForm;