import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../assets/styles/Client.css";
import { UserPlus, Pencil, HandCoins, NotebookTabs } from "lucide-react";
import axios from "axios";
import Swal from 'sweetalert2';

function Client() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState({
    clientName: '',
    email: '',
    phoneNumber: '',
    location: '',
    typeOfWork: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleManageClick = () => {
    navigate('/client-manage');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
    setClientDetails({
      clientName: '',
      email: '',
      phoneNumber: '',
      location: '',
      typeOfWork: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/clients/insert`, clientDetails);
      handleCloseModal();
      
      // Show success alert in top right and navigate immediately without waiting
      Swal.fire({
        title: 'Success!',
        text: 'Client added successfully!',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      navigate(`/client-details/${response.data.id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while adding the client';
      setError(errorMessage);
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`dashboard-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="card-container">
          <div className="card">
            <UserPlus size={50} />
            <h3>ADD CLIENT</h3>
            <button onClick={handleAddClick}>Add</button>
          </div>
          <div className="card">
            <Pencil size={50} />
            <h3>MANAGE CLIENTS</h3>
            <button onClick={handleManageClick}>Manage</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Client Details</h2>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="client-form">
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label htmlFor="clientName">Client Name:</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={clientDetails.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={clientDetails.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={clientDetails.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={clientDetails.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="typeOfWork">Type of Work:</label>
                <select
                  id="typeOfWork"
                  name="typeOfWork"
                  value={clientDetails.typeOfWork}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="interior">Interior</option>
                  <option value="3d">3D</option>
                  <option value="permit">Permit</option>
                </select>
              </div>
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Submit'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Client;
