import { useState, useEffect } from 'react';
import { api } from '../services/api';

const INITIAL_FORM = {
  staff_name: '',
  customer_name: '',
  destination: '',
  travel_date: '',
  trip_duration: '',
  budget: 'Medium',
  vehicle_type: 'Sedan',
  num_passengers: '1',
  purpose: 'Tourism',
  luxury_level: 'Premium',
  special_requests: '',
  addons: [],
  current_package: '',
  current_vehicle: '',
  current_price: '',
  current_addons: ''
};

const INITIAL_FEEDBACK = {
  rating: 0,
  comment: ''
};

const getSavedDraft = (defaultForm) => {
  const saved = localStorage.getItem('manivtha-form-draft');
  if (saved) {
    try {
      return { ...defaultForm, ...JSON.parse(saved) };
    } catch (e) {
      return defaultForm;
    }
  }
  return defaultForm;
};

export const useGenerator = (onSuccess = null) => {
  const [formData, setFormData] = useState(() => getSavedDraft(INITIAL_FORM));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Feedback states
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Auto-save draft on form change
  useEffect(() => {
    // Only save if there is some input (don't overwrite with empty values on mount)
    const hasInputs = Object.keys(formData).some(
      key => key !== 'staff_name' && key !== 'budget' && key !== 'vehicle_type' && 
             key !== 'num_passengers' && key !== 'purpose' && key !== 'luxury_level' && 
             key !== 'addons' && formData[key] !== ''
    );
    if (hasInputs) {
      localStorage.setItem('manivtha-form-draft', JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle multi-select addons array
      setFormData(prev => {
        const currentAddons = prev.addons || [];
        if (checked) {
          return { ...prev, addons: [...currentAddons, value] };
        } else {
          return { ...prev, addons: currentAddons.filter(item => item !== value) };
        }
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const setDirectFormValue = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const camelToSnake = (data) => {
    const mapping = {
      customerName: 'customer_name',
      vehicleType: 'vehicle_type',
      travelDate: 'travel_date',
      tripDuration: 'trip_duration',
      numPassengers: 'num_passengers',
      luxuryLevel: 'luxury_level',
      specialRequests: 'special_requests',
      currentPackage: 'current_package',
      currentVehicle: 'current_vehicle',
      currentPrice: 'current_price',
      currentAddons: 'current_addons',
      staffName: 'staff_name',
    };
    const result = {};
    for (const [key, val] of Object.entries(data || {})) {
      result[mapping[key] || key] = val;
    }
    return result;
  };

  const applyPreset = (preset) => {
    if (preset && preset.data) {
      const mapped = camelToSnake(preset.data);
      setFormData(prev => ({
        ...INITIAL_FORM,
        ...mapped,
        staff_name: prev.staff_name || mapped.staff_name || ''
      }));
    }
  };

  const generateScript = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setFeedbackSubmitted(false);
    setFeedback(INITIAL_FEEDBACK);

    try {
      const data = await api.generateScript(formData);
      setResult(data);
      
      // Clear the draft on successful generation
      localStorage.removeItem('manivtha-form-draft');

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error('Error generating script:', err);
      setError(err.message || 'Failed to generate script. Check server connections.');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!result || !result.id) return;
    if (feedback.rating === 0) return;

    setFeedbackLoading(true);
    setError(null);

    try {
      await api.submitFeedback({
        generation_id: result.id,
        rating: feedback.rating,
        comment: feedback.comment
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const setRating = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const setComment = (comment) => {
    setFeedback(prev => ({ ...prev, comment }));
  };

  const resetGenerator = () => {
    setFormData(prev => ({
      ...INITIAL_FORM,
      staff_name: prev.staff_name // Keep staff name
    }));
    setResult(null);
    setError(null);
    setFeedback(INITIAL_FEEDBACK);
    setFeedbackSubmitted(false);
    localStorage.removeItem('manivtha-form-draft');
  };

  return {
    formData,
    loading,
    result,
    error,
    feedback,
    feedbackSubmitted,
    feedbackLoading,
    setResult,
    handleInputChange,
    setDirectFormValue,
    applyPreset,
    generateScript,
    submitFeedback,
    setRating,
    setComment,
    resetGenerator
  };
};
