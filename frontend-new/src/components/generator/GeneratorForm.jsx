import React from 'react';
import { Send } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

export const GeneratorForm = ({ formData, onChange, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Input
        label="Staff Member Name"
        name="staff_name"
        value={formData.staff_name}
        onChange={onChange}
        placeholder="e.g. Rahul"
        required
      />

      <Input
        label="Customer Details"
        name="customer_details"
        value={formData.customer_details}
        onChange={onChange}
        placeholder="e.g. Mr. Kapoor (Regular Client)"
        required
      />

      <Textarea
        label="Current Booking & Inputs"
        name="booking_inputs"
        value={formData.booking_inputs}
        onChange={onChange}
        placeholder="Describe the current booking and what package/upgrade to upsell (e.g. booked a Swift for 2 days. Upsell a 5-day outstation package)..."
        required
        rows={4}
      />

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        icon={Send}
        className="w-full py-3 text-sm tracking-wide"
      >
        {loading ? 'Generating Script...' : 'Generate Upsell Script'}
      </Button>
    </form>
  );
};
