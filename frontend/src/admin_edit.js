import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin_edit.css';

function AdminEdit() {
    const [sarees, setSarees] = useState([]);
    const [editingSaree, setEditingSaree] = useState(null);
    const [formData, setFormData] = useState({
        sareeId: '',
        addedDate: '',
        title: '',
        price: '',
        fabric: '',
        color: '',
        stockAvailability: '',
        stock: '',
        customization: '',
        designPattern: '',
        embroideryStyle: '',
        description: '',
        occasion: '',
        image: null,
        mainColor: '',
    });

    const fabrics = [
        'Cotton Sarees',
        'Silk Sarees',
        'Linen Sarees',
        'Georgette Sarees',
        'Chiffon Sarees',
        'Crepe Sarees',
        'Net Sarees',
        'Banarasi Sarees',
        'Kanchipuram Sarees',
        'Bathik',
    ];
    const occasions = ['Wedding', 'Party', 'Casual', 'Festive', 'Formal', 'Sale'];
    const stockAvailabilityOptions = ['In Stock', 'Out of Stock', 'Low Stock', 'Reserved'];
    const customizationOptions = ['Yes', 'No'];
    const designPatterns = [
        'Paisley (Mango Design) – A classic teardrop motif seen in silk and Banarasi sarees',
        'Floral Motifs – Inspired by nature, common in Chikankari and Chanderi sarees',
        'Ikat Patterns – Geometric, tie-dye weaving technique seen in Sambalpuri and Pochampally sarees',
        'Checks & Stripes – Simple yet elegant, found in Kanjivaram and Chettinad sarees',
        'Temple Border – Triangular temple-like patterns along the border (Kanchipuram sarees)',
        'Zari Weaving – Gold or silver threadwork, common in Banarasi and Paithani sarees',
        'Bandhani (Tie & Dye) – Small dot patterns formed by tying and dyeing, seen in Gujarati and Rajasthani sarees',
        'Abstract Prints – Bold, artistic designs with modern aesthetics',
        'Geometric Designs – Lines, squares, or triangles giving a structured look',
        'Minimalist Designs – Solid colors or subtle embroidery for a classy look',
        'Digital Prints – Printed sarees with photographic or artistic imagery',
        'Zardozi Work – Heavy metallic embroidery, ideal for bridal sarees',
        'Mirror Work – Small mirror embellishments, popular in Gujarat and Rajasthan',
        'Sequin & Stone Work – Shimmery decorations for party wear sarees',
        'Kashida Embroidery – Kashmiri embroidery featuring intricate floral designs',
        'Kantha Stitch – Running stitch embroidery, popular in Bengal',
        'Contrast Border – Different-colored borders for a striking look',
        'Broad Zari Borders – Heavy gold/silver zari borders for a royal feel',
        'Heavy Pallu Design – Pallu with intricate embroidery or weaving',
        'Lace Borders – Delicate lace for a feminine, elegant touch',
    ];
    const embroideryStyles = [
        'Zardozi Embroidery – Heavy metallic embroidery using gold/silver threads (popular for bridal wear)',
        'Chikankari Embroidery – Delicate hand embroidery from Lucknow, featuring floral and paisley designs',
        'Kantha Embroidery – Running stitch embroidery from Bengal, often depicting nature and folklore',
        'Kashida Embroidery – Kashmiri embroidery known for detailed floral and bird motifs',
        'Phulkari Embroidery – Punjabi embroidery with colorful floral threadwork, common in festive sarees',
        'Aari Embroidery – Intricate chain stitch embroidery done with a hooked needle (popular in bridal sarees)',
        'Mirror Work (Shisha Embroidery) – Small mirrors stitched onto fabric, common in Rajasthani and Gujarati sarees',
        'Sequin & Stone Work – Embellishments using sequins, stones, and beads for party wear sarees',
        'Thread Embroidery – Simple, elegant embroidery using cotton or silk threads',
        'Appliqué Embroidery – Fabric patches stitched onto sarees for decorative effect',
        'Cutwork Embroidery – Laser-cut or hand-cut embroidery that creates delicate lace-like designs',
        'Bead & Pearl Embroidery – Beaded embellishments for luxurious and heavy sarees',
        'Resham Embroidery – Silk thread embroidery, giving a smooth and glossy finish',
        'Gota Patti Work – Rajasthani embroidery using gold/silver lace',
        'Parsi Gara Embroidery – Intricate Persian-style embroidery with floral and bird motifs',
        'Toda Embroidery – Tribal embroidery from Tamil Nadu with red and black geometric patterns',
        'Rabari Embroidery – Colorful and detailed embroidery from Gujarat with mirrors and motifs',
        'Chamba Rumal Embroidery – Himachali double-sided embroidery with mythological scenes',
        'Lace Embroidery – Delicate lacework, suitable for modern sarees',
        'Tone-on-Tone Embroidery – Subtle embroidery using the same color thread as the saree fabric',
        'Fusion Embroidery – Mix of different embroidery styles for a unique design',
    ];

    // Fetch all sarees on component mount
    useEffect(() => {
        fetchSarees();
    }, []);

    const fetchSarees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sarees');
            console.log('Fetched sarees:', response.data); // Log the fetched data for debugging
            setSarees(response.data);
        } catch (err) {
            console.error('Error fetching sarees:', err); // Log the error for debugging
            alert('Error fetching sarees: ' + err.message);
        }
    };

    const handleEdit = (saree) => {
        setEditingSaree(saree);
        setFormData({
            sareeId: saree.sareeId || '',
            addedDate: saree.addedDate || '',
            title: saree.title || '',
            price: saree.price || '',
            fabric: saree.fabric || '',
            color: saree.color || '',
            stockAvailability: saree.stockAvailability || '',
            stock: saree.stock || '',
            customization: saree.customization || '',
            designPattern: saree.designPattern || '',
            embroideryStyle: saree.embroideryStyle || '',
            description: saree.description || '',
            occasion: saree.occasion || '',
            image: null,
            mainColor: saree.mainColor || '',
        });
    };
    //adding backend

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this saree?')) {
            try {
                await axios.delete(`http://localhost:5000/api/sarees/${id}`);
                alert('Saree deleted successfully!');
                fetchSarees(); // Refresh the list
            } catch (err) {
                console.error('Error deleting saree:', err);
                alert('Error deleting saree: ' + err.message);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedFormData = new FormData();
        for (const key in formData) {
            if (formData[key] !== null) {
                updatedFormData.append(key, formData[key]);
            }
        }

        try {
            await axios.put(`http://localhost:5000/api/sarees/${editingSaree._id}`, updatedFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Saree updated successfully!');
            setEditingSaree(null);
            setFormData({
                sareeId: '',
                addedDate: '',
                title: '',
                price: '',
                fabric: '',
                color: '',
                stockAvailability: '',
                stock: '',
                customization: '',
                designPattern: '',
                embroideryStyle: '',
                description: '',
                occasion: '',
                image: null,
                mainColor: '',
            });
            fetchSarees(); // Refresh the list
        } catch (err) {
            console.error('Error updating saree:', err);
            alert('Error updating saree: ' + err.message);
        }
    };

    const handleCancel = () => {
        setEditingSaree(null);
        setFormData({
            sareeId: '',
            addedDate: '',
            title: '',
            price: '',
            fabric: '',
            color: '',
            stockAvailability: '',
            stock: '',
            customization: '',
            designPattern: '',
            embroideryStyle: '',
            description: '',
            occasion: '',
            image: null,
            mainColor: '',
        });
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Edit or delete sarees in the inventory</p>
            </div>

            {/* List of Sarees */}
            {!editingSaree ? (
                <div className="saree-list-container">
                    <h2>Saree Inventory</h2>
                    {sarees.length === 0 ? (
                        <p>No sarees found in the inventory.</p>
                    ) : (
                        <table className="saree-list-table">
                            <thead>
                                <tr>
                                    <th>Saree ID</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Fabric</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sarees.map((saree) => (
                                    <tr key={saree._id}>
                                        <td>{saree.sareeId}</td>
                                        <td>{saree.title}</td>
                                        <td>₹{saree.price}</td>
                                        <td>{saree.fabric}</td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(saree)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(saree._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                /* Edit Form */
                <div className="edit-saree-container">
                    <h2>Edit Saree</h2>
                    <form onSubmit={handleUpdate} className="edit-saree-form">
                        <table className="edit-saree-table">
                            <tbody>
                                <tr>
                                    <td className="label-cell">Saree ID</td>
                                    <td className="input-cell">
                                        <input
                                            type="text"
                                            name="sareeId"
                                            value={formData.sareeId}
                                            onChange={handleChange}
                                            placeholder="Enter unique saree ID"
                                            required
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
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Title</td>
                                    <td className="input-cell">
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter saree title"
                                            required
                                        />
                                    </td>
                                </tr>
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
                                    <td className="label-cell">Price (LKR)</td>
                                    <td className="input-cell">
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="Enter price"
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
                                            <option value="" disabled>Select fabric</option>
                                            {fabrics.map((fabric, index) => (
                                                <option key={index} value={fabric}>{fabric}</option>
                                            ))}
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
                                            <option value="" disabled>Select stock availability</option>
                                            {stockAvailabilityOptions.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
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
                                            placeholder="Enter stock"
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
                                            <option value="" disabled>Select customization</option>
                                            {customizationOptions.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
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
                                            <option value="" disabled>Select occasion</option>
                                            {occasions.map((occasion, index) => (
                                                <option key={index} value={occasion}>{occasion}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Design Patterns</td>
                                    <td className="input-cell">
                                        <select
                                            name="designPattern"
                                            value={formData.designPattern}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Select design pattern</option>
                                            {designPatterns.map((pattern, index) => (
                                                <option key={index} value={pattern}>{pattern}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Embroidery Styles</td>
                                    <td className="input-cell">
                                        <select
                                            name="embroideryStyle"
                                            value={formData.embroideryStyle}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Select embroidery style</option>
                                            {embroideryStyles.map((style, index) => (
                                                <option key={index} value={style}>{style}</option>
                                            ))}
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
                                            placeholder="Enter description"
                                            rows="4"
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Upload Image</td>
                                    <td className="input-cell">
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        {/* Display the current image if it exists */}
                                        {editingSaree.image && (
                                            <div style={{ marginTop: '10px' }}>
                                                <p>Current Image:</p>
                                                <img
                                                    src={`http://localhost:5000${editingSaree.image}`}
                                                    alt="Current Saree"
                                                    style={{
                                                        maxWidth: '200px',
                                                        maxHeight: '200px',
                                                        borderRadius: '5px',
                                                        border: '1px solid #D4AF37', // Gold border to match the theme
                                                        marginTop: '5px',
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="submit-cell">
                                        <button type="submit">Update Saree</button>
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminEdit;