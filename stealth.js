import React, { useState, useEffect } from 'react';

const formResponses = {
  userInfo: [  //user info
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'age', label: 'Age', type: 'number', required: false },
  ],
  addressInfo: [ //address info
    { name: 'street', label: 'Street', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'dropdown', options: ['California', 'Texas', 'New York'], required: true },
    { name: 'zipCode', label: 'Zip Code', type: 'text', required: false },
  ],
  paymentInfo: [ //payment info
    { name: 'cardNumber', label: 'Card Number', type: 'text', required: true },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
    { name: 'cvv', label: 'CVV', type: 'password', required: true },
    { name: 'cardholderName', label: 'Cardholder Name', type: 'text', required: true },
  ]
};

const DynamicForm = () => {
  const [selectedForm, setSelectedForm] = useState('');
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState([]);

  useEffect(() => {
    setFormData({});
    setProgress(0);
    setErrorMessage('');
  }, [selectedForm]);

  const handleFormChange = (e) => {
    setSelectedForm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      const filledFields = Object.values(updatedData).filter(Boolean).length;
      setProgress(Math.round((filledFields / formResponses[selectedForm].length) * 100));
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = formResponses[selectedForm].filter((field) => field.required);
    const isValid = requiredFields.every((field) => formData[field.name]);

    if (!isValid) {
      setErrorMessage('Please fill all required fields.');
    } else {
      setSubmittedData((prevData) => [...prevData, formData]);
      setFormData({});
      setProgress(0);
      setErrorMessage('');
      alert('Form submitted successfully!');
    }
  };

// for delete entry
  const handleDelete = (index) => {
    const newData = [...submittedData];
    newData.splice(index, 1);
    setSubmittedData(newData);
  };

// for edit entry
  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    const newData = [...submittedData];
    newData.splice(index, 1);
    setSubmittedData(newData);
  };

  return (
    <div>
      <h1>Dynamic Form Example</h1>

      <div>
        <select onChange={handleFormChange} value={selectedForm}>
          <option value="">Select Form Type</option>
          <option value="userInfo">User Information</option>
          <option value="addressInfo">Address Information</option>
          <option value="paymentInfo">Payment Information</option>
        </select>
      </div>

      {selectedForm && (
        <form onSubmit={handleSubmit}>
          {formResponses[selectedForm].map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              {field.type === 'dropdown' ? (
                <select
                  name={field.name}
                  onChange={handleInputChange}
                  value={formData[field.name] || ''}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  onChange={handleInputChange}
                  value={formData[field.name] || ''}
                />
              )}
              {field.required && !formData[field.name] && <span className="error">This field is required.</span>}
            </div>
          ))}

          <button type="submit">Submit</button>
        </form>
      )}

      {errorMessage && <div className="error">{errorMessage}</div>}

      <div>
        <h3>Progress: {progress}%</h3>
      </div>

      <div>
        <h3>Submitted Data</h3>
        {submittedData.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                {formResponses[selectedForm]?.map((field) => (
                  <th key={field.name}>{field.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {formResponses[selectedForm]?.map((field) => (
                    <td key={field.name}>{data[field.name]}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;
