import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminEdit() {
    const [sarees, setSarees] = useState([]);
    const [editingSaree, setEditingSaree] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSarees();
    }, []);

    const fetchSarees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sarees');
            setSarees(response.data);
        } catch (error) {
            console.error('Error fetching sarees:', error);
        }
    };

    const handleEdit = (saree) => {
        setEditingSaree(saree);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingSaree(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/sarees/${editingSaree._id}`, editingSaree);
            setEditingSaree(null);
            fetchSarees();
        } catch (error) {
            console.error('Error updating saree:', error);
        }
    };

    return (
        <div className="admin-edit-container">
            <h2>Edit/Delete Sarees</h2>
            {editingSaree ? (
                <form onSubmit={handleEditSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Title:</td>
                                <td><input type="text" name="title" value={editingSaree.title} onChange={handleEditChange} /></td>
                            </tr>
                            <tr>
                                <td>Main Color:</td>
                                <td>
                                    <select 
                                        name="mainColor" 
                                        value={editingSaree.mainColor} 
                                        onChange={handleEditChange}
                                        required
                                    >
                                        <option value="">Select Main Color</option>
                                        <option value="Red">Red</option>
                                        <option value="Blue">Blue</option>
                                        <option value="Green">Green</option>
                                        <option value="Yellow">Yellow</option>
                                        <option value="Purple">Purple</option>
                                        <option value="Pink">Pink</option>
                                        <option value="Orange">Orange</option>
                                        <option value="Brown">Brown</option>
                                        <option value="Black">Black</option>
                                        <option value="White">White</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Silver">Silver</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Color:</td>
                                <td><input type="color" name="color" value={editingSaree.color} onChange={handleEditChange} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="button-group">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setEditingSaree(null)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <table className="sarees-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Main Color</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sarees.map(saree => (
                            <tr key={saree._id}>
                                <td>{saree.title}</td>
                                <td>{saree.mainColor}</td>
                                <td>LKR {saree.price}</td>
                                <td>
                                    <button onClick={() => handleEdit(saree)}>Edit</button>
                                    <button onClick={() => handleDelete(saree._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminEdit; 