import { useAuth } from '@clerk/nextjs';
import React, { useState } from 'react';

export const BasicForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    id: '',
  });
  const [formErrors, setFormErrors] = useState({ id: '' });
  const { getToken } = useAuth();
  // Function to validate kebab case
  const isKebabCase = (str) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate ID for kebab case
    if (name === 'id' && value && !isKebabCase(value)) {
      setFormErrors({ ...formErrors, id: 'ID must be in kebab-case.' });
    } else {
      setFormErrors({ ...formErrors, id: '' });
    }
  };

  const handleSubmit = async (event) => {
    const token = await getToken({ template: 'supabase' });

    event.preventDefault();

    if (!isKebabCase(formData.id)) {
      setFormErrors({ ...formErrors, id: 'ID must be in kebab-case.' });
      return;
    }

    console.log('Form Data Submitted:', formData);

    try {
      if (!isKebabCase(formData.id)) {
        setFormErrors({ ...formErrors, id: 'ID must be in kebab-case.' });
        return;
      }
      const response = await fetch('/api/create-stack-boilerplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response:', responseData);
      // Handle success here
    } catch (error) {
      console.error('Error during fetch:', error);
      // Handle errors here
    }
  };

  return (
    <div className="w-3/4 md:w-1/2">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="mb-2 p-2 border border-gray-400 rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="mb-2 p-2 border border-gray-400 rounded"
          required
        />
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="ID (kebab-case)"
          className="mb-2 p-2 border border-gray-400 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BasicForm;
