import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export const BasicForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    id: '',
  });
  const [formErrors, setFormErrors] = useState({ id: '' });
  const [Message, setMessage] = useState('');
  const { getToken } = useAuth();

  const isKebabCase = (str) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'id' && value && !isKebabCase(value)) {
      setFormErrors({ ...formErrors, id: 'ID must be in kebab-case.' });
    } else {
      setFormErrors({ ...formErrors, id: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = await getToken({ template: 'supabase' });

    if (!isKebabCase(formData.id)) {
      setFormErrors({ ...formErrors, id: 'ID must be in kebab-case.' });
      return;
    }

    try {
      const response = await fetch('/api/create-stack-boilerplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Form submitted successfully!');
        const responseData = await response.json();
        console.log('Response:', responseData);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setMessage('Error on form submission');
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
        {Message && <div className="text-green-500 mt-2">{Message}</div>}
      </form>
    </div>
  );
};

export default BasicForm;
