import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './add_saree.css';

function AddSaree() {
    const navigate = useNavigate();
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    const generateSareeId = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `SR-${year}${month}${day}-${random}`;
    };

    const [formData, setFormData] = useState({
        sareeId: generateSareeId(),
        addedDate: today,
        title: '',
        price: '',
        salePrice: '',
        mainColor: '',
        color: '#000000',
        fabric: '',
        stockAvailability: '',
        stock: '',
        customization: '',
        description: '',
        occasion: '',
        designPattern: '',
        embroideryStyle: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // For date field, ensure only today's date can be selected
        if (name === 'addedDate' && value !== today) {
            alert('Please select today\'s date only.');
            return;
        }
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create FormData instance
            const data = new FormData();
            
            // Append all form fields directly
            Object.keys(formData).forEach(key => {
                if (key === 'image') {
                    if (formData.image) {
                        data.append('image', formData.image);
                    }
                } else if (key === 'salePrice' && formData[key] === '') {
                    // Don't append empty salePrice
                } else if (key === 'price' || key === 'stock' || key === 'salePrice') {
                    // Convert numeric fields
                    data.append(key, Number(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            });

            const response = await axios.post('http://localhost:5000/api/sarees', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                alert('Saree added successfully!');
                navigate('/admin');
            }
        } catch (error) {
            console.error('Error adding saree:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || error.message || 'Please try again.';
            alert(`Error adding saree: ${errorMessage}`);
        }
        //adding recipie 
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Add a new saree to the inventory</p>
            </div>
            <div className="add-saree-container">
                <form onSubmit={handleSubmit} className="add-saree-form">
                    <table className="add-saree-table">
                        <tbody>
                            <tr>
                                <td className="label-cell">Saree ID</td>
                                <td className="input-cell">
                                    <input
                                        type="text"
                                        name="sareeId"
                                        value={formData.sareeId}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Added Date</td>
                                <td className="input-cell">
                                    <input
                                        type="date"
                                        name="addedDate"
                                        value={formData.addedDate}
                                        onChange={handleChange}
                                        min={today}
                                        max={today}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Title of the Saree</td>
                                <td className="input-cell">
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Price (LKR)</td>
                                <td className="input-cell">
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                    //adding css for recipie form
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Sale Price (LKR)</td>
                                <td className="input-cell">
                                    <input
                                        type="number"
                                        name="salePrice"
                                        value={formData.salePrice}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                    />
                                </td>
                            </tr>//
                            <tr>
                                <td className="label-cell">Main Color</td>
                                <td className="input-cell">
                                    <select
                                        name="mainColor"
                                        value={formData.mainColor}
                                        onChange={handleChange}
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
                                <td className="label-cell">Color</td>
                                <td className="input-cell">
                                    <input
                                        type="color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Fabric</td>
                                <td className="input-cell">
                                    <select
                                        name="fabric"
                                        value={formData.fabric}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Fabric</option>
                                        <option value="Cotton Sarees">Cotton Sarees</option>
                                        <option value="Silk Sarees">Silk Sarees</option>
                                        <option value="Linen Sarees">Linen Sarees</option>
                                        <option value="Georgette Sarees">Georgette Sarees</option>
                                        <option value="Chiffon Sarees">Chiffon Sarees</option>
                                        <option value="Crepe Sarees">Crepe Sarees</option>
                                        <option value="Net Sarees">Net Sarees</option>
                                        <option value="Banarasi Sarees">Banarasi Sarees</option>
                                        <option value="Kanchipuram Sarees">Kanchipuram Sarees</option>
                                        <option value="Bathik">Bathik</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Stock Availability</td>
                                <td className="input-cell">
                                    <select
                                        name="stockAvailability"
                                        value={formData.stockAvailability}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Availability</option>
                                        <option value="In Stock">In Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                        <option value="Low Stock">Low Stock</option>
                                        <option value="Reserved">Reserved</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Stock</td>
                                <td className="input-cell">
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Customization</td>
                                <td className="input-cell">
                                    <select
                                        name="customization"
                                        value={formData.customization}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Occasion</td>
                                <td className="input-cell">
                                    <select
                                        name="occasion"
                                        value={formData.occasion}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Occasion</option>
                                        <option value="Wedding">Wedding</option>
                                        <option value="Party">Party</option>
                                        <option value="Casual">Casual</option>
                                        <option value="Festive">Festive</option>
                                        <option value="Formal">Formal</option>
                                        <option value="Sale">Sale</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Design Pattern</td>
                                <td className="input-cell">
                                    <select
                                        name="designPattern"
                                        value={formData.designPattern}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Design Pattern</option>
                                        <option value="Paisley">Paisley (Mango Design)</option>
                                        <option value="Floral Motifs">Floral Motifs</option>
                                        <option value="Ikat Patterns">Ikat Patterns</option>
                                        <option value="Checks & Stripes">Checks & Stripes</option>
                                        <option value="Temple Border">Temple Border</option>
                                        <option value="Zari Weaving">Zari Weaving</option>
                                        <option value="Bandhani">Bandhani (Tie & Dye)</option>
                                        <option value="Abstract Prints">Abstract Prints</option>
                                        <option value="Geometric Designs">Geometric Designs</option>
                                        <option value="Minimalist Designs">Minimalist Designs</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Embroidery Style</td>
                                <td className="input-cell">
                                    <select
                                        name="embroideryStyle"
                                        value={formData.embroideryStyle}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Embroidery Style</option>
                                        <option value="Zardozi">Zardozi Embroidery</option>
                                        <option value="Chikankari">Chikankari Embroidery</option>
                                        <option value="Kantha">Kantha Embroidery</option>
                                        <option value="Kashida">Kashida Embroidery</option>
                                        <option value="Phulkari">Phulkari Embroidery</option>
                                        <option value="Aari">Aari Embroidery</option>
                                        <option value="Mirror Work">Mirror Work</option>
                                        <option value="Thread">Thread Embroidery</option>
                                        <option value="Cutwork">Cutwork Embroidery</option>
                                        <option value="Resham">Resham Embroidery</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Description</td>
                                <td className="input-cell">
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Image</td>
                                <td className="input-cell">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="submit-cell">
                                    <button type="submit">Add Saree</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    );
}

export default AddSaree;

