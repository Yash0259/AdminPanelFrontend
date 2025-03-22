import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProductPage } from '../Pages/ProductPage';

export const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/" />} />
            <Route path="/" element={<ProductPage />} />
        </Routes>
    );
};
