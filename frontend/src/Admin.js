import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie, Sector } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './Admin.css';

function Admin() {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [lowStockSarees, setLowStockSarees] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalSarees: 0,
        fabricCounts: {},
        stockStatus: {
            inStock: 0,
            outOfStock: 0,
            lowStock: 0
        },
        customizationCount: {
            yes: 0,
            no: 0
        },
        saleSarees: 0
    });
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (activeMenu === 'lowStock') {
            fetchLowStockSarees();
        }
        if (activeMenu === 'analytics') {
            fetchAnalytics();
        }
    }, [activeMenu]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sarees');
            const sarees = response.data;
            
            // Calculate all analytics
            const analytics = {
                totalSarees: sarees.length,
                fabricCounts: {},
                stockStatus: {
                    inStock: 0,
                    outOfStock: 0,
                    lowStock: 0
                },
                customizationCount: {
                    yes: 0,
                    no: 0
                },
                saleSarees: 0
            };

            sarees.forEach(saree => {
                // Count by fabric
                analytics.fabricCounts[saree.fabric] = (analytics.fabricCounts[saree.fabric] || 0) + 1;

                // Count by stock status
                switch (saree.stockAvailability) {
                    case 'In Stock':
                        analytics.stockStatus.inStock++;
                        break;
                    case 'Out of Stock':
                        analytics.stockStatus.outOfStock++;
                        break;
                    case 'Low Stock':
                        analytics.stockStatus.lowStock++;
                        break;
                    default:
                        break;
                }

                // Count customization
                if (saree.customization === 'Yes') {
                    analytics.customizationCount.yes++;
                } else {
                    analytics.customizationCount.no++;
                }

                // Count sale sarees
                if (saree.occasion === 'Sale') {
                    analytics.saleSarees++;
                }
            });

            setAnalytics(analytics);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const fetchLowStockSarees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sarees');
            const lowStock = response.data.filter(saree => 
                saree.stockAvailability === 'Low Stock' || 
                (saree.stock <= 5 && saree.stockAvailability !== 'Out of Stock')
            );
            setLowStockSarees(lowStock);
        } catch (error) {
            console.error('Error fetching low stock sarees:', error);
        }
    };

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path
                    d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                    stroke={fill}
                    fill="none"
                />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    textAnchor={textAnchor}
                    fill="#333"
                >{`${value} items`}</text>
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    dy={18}
                    textAnchor={textAnchor}
                    fill="#999"
                >
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const generateReport = async () => {
        const reportRef = document.createElement('div');
        reportRef.className = 'report-container';
        
        // Base64 encoded Punarvasthra logo with gold gradient text
        const logoBase64 = `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="80" viewBox="0 0 300 80">
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#D4AF37;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFD700;stop-opacity:1" />
                    </linearGradient>
                    <filter id="goldDust" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur"/>
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goldDust"/>
                        <feBlend in="SourceGraphic" in2="goldDust" mode="normal"/>
                    </filter>
                </defs>
                <text x="10" y="55" 
                    font-family="Brush Script MT, cursive" 
                    font-size="50" 
                    fill="url(#goldGradient)"
                    filter="url(#goldDust)"
                    style="font-style: italic;">
                    Punarvasthra
                </text>
                <line x1="10" y1="65" x2="270" y2="65" 
                    stroke="url(#goldGradient)" 
                    stroke-width="3"
                    filter="url(#goldDust)"/>
            </svg>
        `)}`;
        
        // Create report content with embedded logo
        reportRef.innerHTML = `
            <div class="report-header" style="padding: 20px; text-align: left;">
                <img src="${logoBase64}" alt="Punarvasthra Logo" class="report-logo" style="width: 300px; height: 80px; margin-bottom: 20px;"/>
            </div>
            <div style="margin-top: 30px;">
                <h1 style="color: #4F032A; font-size: 24px; margin: 20px 0 10px; text-align: center;">Inventory Report</h1>
                <p class="report-date" style="color: #666; font-style: italic; text-align: center;">Generated on: ${new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</p>
            </div>
            <div class="report-summary">
                <h2 style="color: #4F032A; font-size: 20px; margin: 30px 0 20px; padding-bottom: 10px; border-bottom: 2px solid #4F032A;">Inventory Summary</h2>
                <div class="summary-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
                    <div class="summary-item" style="background: rgba(79, 3, 42, 0.05); padding: 20px; border-radius: 8px;">
                        <h3 style="color: #4F032A; font-size: 16px; margin-bottom: 10px;">Total Inventory</h3>
                        <p style="color: #666;">${analytics.totalSarees} Sarees</p>
                    </div>
                    <div class="summary-item" style="background: rgba(79, 3, 42, 0.05); padding: 20px; border-radius: 8px;">
                        <h3 style="color: #4F032A; font-size: 16px; margin-bottom: 10px;">Stock Status</h3>
                        <p style="color: #666;">In Stock: ${analytics.stockStatus.inStock}</p>
                        <p style="color: #666;">Out of Stock: ${analytics.stockStatus.outOfStock}</p>
                        <p style="color: #666;">Low Stock: ${analytics.stockStatus.lowStock}</p>
                    </div>
                    <div class="summary-item" style="background: rgba(79, 3, 42, 0.05); padding: 20px; border-radius: 8px;">
                        <h3 style="color: #4F032A; font-size: 16px; margin-bottom: 10px;">Customization Options</h3>
                        <p style="color: #666;">Available: ${analytics.customizationCount.yes}</p>
                        <p style="color: #666;">Not Available: ${analytics.customizationCount.no}</p>
                    </div>
                    <div class="summary-item" style="background: rgba(79, 3, 42, 0.05); padding: 20px; border-radius: 8px;">
                        <h3 style="color: #4F032A; font-size: 16px; margin-bottom: 10px;">Sale Items</h3>
                        <p style="color: #666;">${analytics.saleSarees} Sarees on Sale</p>
                    </div>
                </div>
            </div>
            <div class="report-details">
                <h2 style="color: #4F032A; font-size: 20px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4F032A;">Fabric Distribution</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr>
                            <th style="background: rgba(79, 3, 42, 0.05); padding: 12px; text-align: left; border-bottom: 2px solid #4F032A; color: #4F032A;">Fabric Type</th>
                            <th style="background: rgba(79, 3, 42, 0.05); padding: 12px; text-align: left; border-bottom: 2px solid #4F032A; color: #4F032A;">Quantity</th>
                            <th style="background: rgba(79, 3, 42, 0.05); padding: 12px; text-align: left; border-bottom: 2px solid #4F032A; color: #4F032A;">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(analytics.fabricCounts)
                            .map(([fabric, count]) => `
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid rgba(79, 3, 42, 0.1); color: #666;">${fabric}</td>
                                    <td style="padding: 12px; border-bottom: 1px solid rgba(79, 3, 42, 0.1); color: #666;">${count}</td>
                                    <td style="padding: 12px; border-bottom: 1px solid rgba(79, 3, 42, 0.1); color: #666;">${((count / analytics.totalSarees) * 100).toFixed(2)}%</td>
                                </tr>
                            `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Temporarily append to document for html2canvas
        document.body.appendChild(reportRef);

        try {
            const canvas = await html2canvas(reportRef, {
                scale: 3, // Increased scale for better quality
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    const logo = clonedDoc.querySelector('.report-logo');
                    if (logo) {
                        logo.style.width = '300px';
                        logo.style.height = '80px';
                    }
                }
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const pageHeight = 297; // A4 height in mm

            let heightLeft = imgHeight;
            let position = 0;
            let pageData = canvas.toDataURL('image/jpeg', 1.0);

            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add new pages if content exceeds one page
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('Punarvasthra_Inventory_Report.pdf');
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            document.body.removeChild(reportRef);
        }
    };

    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return (
                    <div className="dashboard-content">
                        <h1>Welcome to Admin Dashboard</h1>
                        <div className="stats-container">
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <h3>Total Sales</h3>
                                    <p>LKR 150,000</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">👗</div>
                                <div className="stat-info">
                                    <h3>Total Products</h3>
                                    <p>250 Sarees</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⚠️</div>
                                <div className="stat-info">
                                    <h3>Low Stock</h3>
                                    <p>15 Items</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return (
                    <div className="analytics-content">
                        <div className="analytics-header">
                            <h2>Analytics Overview</h2>
                            <button className="generate-report-btn" onClick={generateReport}>
                                <span className="report-icon">📄</span>
                                Generate Report
                            </button>
                        </div>
                        <div className="analytics-cards">
                            <div className="analytics-card total-count">
                                <h3>Total Inventory</h3>
                                <div className="analytics-value">{analytics.totalSarees}</div>
                                <p>Total Sarees in System</p>
                            </div>

                            <div className="analytics-card fabric-counts">
                                <h3>Fabric Distribution</h3>
                                <ul>
                                    {Object.entries(analytics.fabricCounts).map(([fabric, count]) => (
                                        <li key={fabric}>
                                            <span>{fabric}</span>
                                            <span className="count-badge">{count}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="analytics-card stock-status">
                                <h3>Stock Status</h3>
                                <ul>
                                    <li>
                                        <span>In Stock</span>
                                        <span className="count-badge in-stock">{analytics.stockStatus.inStock}</span>
                                    </li>
                                    <li>
                                        <span>Out of Stock</span>
                                        <span className="count-badge out-of-stock">{analytics.stockStatus.outOfStock}</span>
                                    </li>
                                    <li>
                                        <span>Low Stock</span>
                                        <span className="count-badge low-stock">{analytics.stockStatus.lowStock}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="analytics-card customization">
                                <h3>Customization Options</h3>
                                <ul>
                                    <li>
                                        <span>Available</span>
                                        <span className="count-badge">{analytics.customizationCount.yes}</span>
                                    </li>
                                    <li>
                                        <span>Not Available</span>
                                        <span className="count-badge">{analytics.customizationCount.no}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="analytics-card sale-items">
                                <h3>Sale Items</h3>
                                <div className="analytics-value highlight">{analytics.saleSarees}</div>
                                <p>Sarees on Sale</p>
                            </div>

                            <div className="analytics-card stock-status-chart">
                                <h3>Stock Status Distribution</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Pie
                                                activeIndex={activeIndex}
                                                activeShape={renderActiveShape}
                                                data={[
                                                    { name: 'In Stock', value: analytics.stockStatus.inStock, fill: '#28a745' },
                                                    { name: 'Out of Stock', value: analytics.stockStatus.outOfStock, fill: '#dc3545' },
                                                    { name: 'Low Stock', value: analytics.stockStatus.lowStock, fill: '#ffc107' }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={90}
                                                dataKey="value"
                                                onMouseEnter={onPieEnter}
                                            >
                                                {[
                                                    { fill: '#28a745' },
                                                    { fill: '#dc3545' },
                                                    { fill: '#ffc107' }
                                                ].map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`}
                                                        fill={entry.fill}
                                                        stroke="rgba(255, 255, 255, 0.8)"
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="analytics-card fabric-chart">
                                <h3>Fabric Distribution Chart</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={Object.entries(analytics.fabricCounts).map(([fabric, count], index) => ({
                                                fabric,
                                                count,
                                                fill: `url(#colorGradient${index})`
                                            }))}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                        >
                                            <defs>
                                                {Object.keys(analytics.fabricCounts).map((_, index) => (
                                                    <linearGradient
                                                        key={`colorGradient${index}`}
                                                        id={`colorGradient${index}`}
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor={[
                                                                '#FF6B6B', // Red
                                                                '#4ECDC4', // Turquoise
                                                                '#45B7D1', // Blue
                                                                '#96CEB4', // Mint
                                                                '#FFEEAD', // Yellow
                                                                '#D4A5A5', // Pink
                                                                '#9B6B9B', // Purple
                                                                '#E9967A', // Peach
                                                                '#66CDAA', // Green
                                                                '#DEB887'  // Brown
                                                            ][index % 10]}
                                                            stopOpacity={0.9}
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor={[
                                                                '#FF8787', // Light Red
                                                                '#83EDD9', // Light Turquoise
                                                                '#7ED4E6', // Light Blue
                                                                '#B5E3D4', // Light Mint
                                                                '#FFF5D1', // Light Yellow
                                                                '#E9C2C2', // Light Pink
                                                                '#B592B5', // Light Purple
                                                                '#FFB6A3', // Light Peach
                                                                '#98E5BE', // Light Green
                                                                '#F0C9A4'  // Light Brown
                                                            ][index % 10]}
                                                            stopOpacity={0.7}
                                                        />
                                                    </linearGradient>
                                                ))}
                                            </defs>
                                            <CartesianGrid 
                                                strokeDasharray="3 3" 
                                                stroke="rgba(79, 3, 42, 0.1)"
                                            />
                                            <XAxis
                                                dataKey="fabric"
                                                angle={-45}
                                                textAnchor="end"
                                                interval={0}
                                                height={60}
                                                tick={{ fill: '#4F032A', fontSize: 12 }}
                                            />
                                            <YAxis 
                                                tick={{ fill: '#4F032A', fontSize: 12 }}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: 'rgba(79, 3, 42, 0.05)' }}
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: '1px solid rgba(79, 3, 42, 0.2)',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Legend 
                                                wrapperStyle={{
                                                    paddingTop: '20px'
                                                }}
                                            />
                                            <Bar
                                                dataKey="count"
                                                name="Number of Sarees"
                                                animationDuration={1500}
                                                animationBegin={200}
                                                radius={[8, 8, 0, 0]}
                                            >
                                                {Object.keys(analytics.fabricCounts).map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={`url(#colorGradient${index})`} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'lowStock':
                return (
                    <div className="low-stock-container">
                        <h2>Low Stock Alerts</h2>
                        {lowStockSarees.length > 0 ? (
                            <div className="low-stock-grid">
                                {lowStockSarees.map(saree => (
                                    <div key={saree._id} className="low-stock-card">
                                        <div className="low-stock-image">
                                            <img 
                                                src={`http://localhost:5000${saree.image}`} 
                                                alt={saree.title}
                                            />
                                            <div className="stock-badge">
                                                Stock: {saree.stock}
                                            </div>
                                        </div>
                                        <div className="low-stock-details">
                                            <h3>{saree.title}</h3>
                                            <p><strong>ID:</strong> {saree.sareeId}</p>
                                            <p><strong>Price:</strong> LKR {saree.price}</p>
                                            <p><strong>Stock:</strong> {saree.stock} units</p>
                                            <p><strong>Status:</strong> 
                                                <span className="status-low">{saree.stockAvailability}</span>
                                            </p>
                                            <button 
                                                className="update-stock-btn"
                                                onClick={() => navigate('/admin/edit')}
                                            >
                                                Update Stock
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-alerts">
                                <p>No low stock alerts at the moment.</p>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                    <p className="admin-subtitle">Punarvasthra Management</p>
                </div>
                <ul className="sidebar-menu">
                    <li className={activeMenu === 'dashboard' ? 'active' : ''}>
                        <button onClick={() => setActiveMenu('dashboard')}>
                            <span className="menu-icon">📊</span>
                            Dashboard Overview
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/admin/add')}>
                            <span className="menu-icon">➕</span>
                            Add a Saree
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/admin/edit')}>
                            <span className="menu-icon">📝</span>
                            Update Inventory
                        </button>
                    </li>
                    <li className={activeMenu === 'analytics' ? 'active' : ''}>
                        <button onClick={() => setActiveMenu('analytics')}>
                            <span className="menu-icon">📈</span>
                            View Analytics
                        </button>
                    </li>
                    <li className={activeMenu === 'lowStock' ? 'active' : ''}>
                        <button onClick={() => setActiveMenu('lowStock')}>
                            <span className="menu-icon">⚠️</span>
                            Low Stock Alerts
                            {lowStockSarees.length > 0 && (
                                <span className="alert-badge">{lowStockSarees.length}</span>
                            )}
                        </button>
                    </li>
                    <li className="back-to-site">
                        <button onClick={() => navigate('/')}>
                            <span className="menu-icon">🏠</span>
                            Back to Site
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default Admin; 