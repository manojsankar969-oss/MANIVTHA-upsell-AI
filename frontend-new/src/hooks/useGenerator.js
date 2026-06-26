import { useState } from 'react';
import { api } from '../services/api';

const INITIAL_FORM = {
  staff_name: '',
  customer_details: '',
  booking_inputs: ''
};

const INITIAL_FEEDBACK = {
  rating: 0,
  comment: ''
};

export const useGenerator = (onSuccess = null) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Feedback states
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyPreset = (preset) => {
    setFormData({
      staff_name: preset.staff_name || '',
      customer_details: preset.customer_details || '',
      booking_inputs: preset.booking_inputs || ''
    });
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
    setFormData(INITIAL_FORM);
    setResult(null);
    setError(null);
    setFeedback(INITIAL_FEEDBACK);
    setFeedbackSubmitted(false);
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
    applyPreset,
    generateScript,
    submitFeedback,
    setRating,
    setComment,
    resetGenerator
  };
};
