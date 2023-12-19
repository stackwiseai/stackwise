"use client"
import SignIn from '@/app/stacks/signIn';
import { supabaseClient } from '@/app/stacks/stack-db';
import { useEffect, useState } from 'react';

export const BasicForm = () => {
  const [formData, setFormData] = useState({
    name:  'My New App',
  });
  const [formErrors, setFormErrors] = useState({ id: '' });
  const [Message, setMessage] = useState('');
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  useEffect(() => {
    // Check if user is signed in
    async function checkUser() {
      try {
        const session = await supabaseClient.auth.getSession()
        const token = session?.data?.session?.provider_token

        if (token) {
          setIsUserSignedIn(true);
          setUsername(session?.data?.session?.user.user_metadata.preferred_username)
          setToken(token)
        }
      } catch {
        console.log("Error getting user")
      }
    }
    checkUser()
  }, []);
  // const { getToken } = useAuth();

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
    setMessage('');
    event.preventDefault();

    try {
      
      // console.log(session, "session")
      const response = await fetch('/api/create-stack-boilerplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Form submitted successfully!');
        const responseData = await response.json();
        console.log('Response:', responseData);
      } else {
        const errorData = await response.json();

        setMessage(errorData.message);
      }
    } catch (error) {
      console.log(error);
      setMessage("error on form submission");

    }
  };

  if (!isUserSignedIn) {
    return (<SignIn/>);
  }

  return (
    <div className="w-3/4 md:w-1/2">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="mb-2 rounded border border-gray-400 p-2"
          required
        />
        {/* Other form elements removed */}
        <button
          type="submit"
          className="rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
        >
          Create my AI App
        </button>
        {Message && <div className="mt-2 text-green-500">{Message}</div>}
      </form>
    </div>
  );
};

export default BasicForm;
