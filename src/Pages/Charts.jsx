// src/Pages/Charts.jsx
import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Charts = () => {
    const [categoryData, setCategoryData] = useState(null);
    const [monthlyCategoryData, setMonthlyCategoryData] = useState(null);

    // Temporary mock data for testing
    const dummyReports = [
        { category: 'Theft', submittedOn: '2024-01-15' },
        { category: 'Assault', submittedOn: '2024-01-18' },
        { category: 'Theft', submittedOn: '2024-02-20' },
        { category: 'Vandalism', submittedOn: '2024-02-25' },
        { category: 'Theft', submittedOn: '2024-03-10' },
        { category: 'Theft', submittedOn: '2024-03-10' },
        { category: 'Theft', submittedOn: '2024-03-10' },
        { category: 'Theft', submittedOn: '2024-03-10' },
        { category: 'Theft', submittedOn: '2024-03-10' },
        { category: 'Theft', submittedOn: '2024-03-10' },
        { category: 'Assault', submittedOn: '2024-03-15' },
    ];

    useEffect(() => {
        console.log("Charts component mounted");  // Debug log
        processCategoryData(dummyReports);
        processMonthlyCategoryData(dummyReports);
    }, []);

    const processCategoryData = (data) => {
        const categoryCount = data.reduce((acc, report) => {
            const category = report.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        setCategoryData({
            labels: Object.keys(categoryCount),
            datasets: [{
                data: Object.values(categoryCount),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            }]
        });
    };

    const processMonthlyCategoryData = (data) => {
        const monthlyData = {};

        data.forEach((report) => {
            const category = report.category || 'Uncategorized';
            const date = new Date(report.submittedOn);
            const month = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (!monthlyData[month]) {
                monthlyData[month] = {};
            }

            monthlyData[month][category] = (monthlyData[month][category] || 0) + 1;
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const categories = Array.from(new Set(data.map(report => report.category || 'Uncategorized')));

        const datasets = categories.map(category => ({
            label: category,
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            data: sortedMonths.map(month => monthlyData[month][category] || 0),
        }));

        setMonthlyCategoryData({
            labels: sortedMonths,
            datasets: datasets,
        });
    };

    if (!categoryData || !monthlyCategoryData) {
        return <p>Loading charts...</p>;
    }

    return (
        <div>
          
            <div style={{ width: '400px', margin: '0 auto' }}>
                <h3>Category Weightage</h3>
                {categoryData && categoryData.labels && categoryData.labels.length > 0 ? (
                    <Pie data={categoryData} />
                ) : (
                    <p>No data available for Category Weightage</p>
                )}
            </div>

            <div style={{ width: '600px', margin: '0 auto' }}>
                <h3>Category Count Per Month</h3>
                {monthlyCategoryData && monthlyCategoryData.labels && monthlyCategoryData.labels.length > 0 ? (
                    <Bar data={monthlyCategoryData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                ) : (
                    <p>No data available for Category Count Per Month</p>
                )}
            </div>
        </div>
    );
};

export default Charts;



// import React, { useEffect, useState } from 'react';
// import { Pie, Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
// import { useLocation } from 'react-router-dom';

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// const Charts = () => {
//     const location = useLocation();
//     const reports = location.state?.reports || []; // Get reports data from state
//     const [categoryData, setCategoryData] = useState(null);
//     const [monthlyCategoryData, setMonthlyCategoryData] = useState(null);

//     useEffect(() => {
//         if (reports.length > 0) {
//             processCategoryData(reports);
//             processMonthlyCategoryData(reports);
//         }
//     }, [reports]);

//     const processCategoryData = (data) => {
//         const categoryCount = data.reduce((acc, report) => {
//             const category = report.category || 'Uncategorized';
//             acc[category] = (acc[category] || 0) + 1;
//             return acc;
//         }, {});

//         setCategoryData({
//             labels: Object.keys(categoryCount),
//             datasets: [{
//                 data: Object.values(categoryCount),
//                 backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
//             }]
//         });
//     };

//     const processMonthlyCategoryData = (data) => {
//         const monthlyData = {};

//         data.forEach((report) => {
//             const category = report.category || 'Uncategorized';
//             const date = new Date(report.createdAt); // Use createdAt to track submission date
//             const month = `${date.getFullYear()}-${date.getMonth() + 1}`;

//             if (!monthlyData[month]) {
//                 monthlyData[month] = {};
//             }

//             monthlyData[month][category] = (monthlyData[month][category] || 0) + 1;
//         });

//         const sortedMonths = Object.keys(monthlyData).sort();
//         const categories = Array.from(new Set(data.map(report => report.category || 'Uncategorized')));

//         const datasets = categories.map(category => ({
//             label: category,
//             backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
//             data: sortedMonths.map(month => monthlyData[month][category] || 0),
//         }));

//         setMonthlyCategoryData({
//             labels: sortedMonths,
//             datasets: datasets,
//         });
//     };

//     if (!categoryData || !monthlyCategoryData) {
//         return <p>Loading charts...</p>;
//     }

//     return (
//         <div>
//             <div style={{ width: '400px', margin: '0 auto' }}>
//                 <h3>Category Weightage</h3>
//                 {categoryData.labels.length > 0 ? (
//                     <Pie data={categoryData} />
//                 ) : (
//                     <p>No data available for Category Weightage</p>
//                 )}
//             </div>

//             <div style={{ width: '600px', margin: '0 auto' }}>
//                 <h3>Category Count Per Month</h3>
//                 {monthlyCategoryData.labels.length > 0 ? (
//                     <Bar data={monthlyCategoryData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
//                 ) : (
//                     <p>No data available for Category Count Per Month</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Charts;
