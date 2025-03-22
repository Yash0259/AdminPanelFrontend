import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProductGrid } from '../Pages/ProductGrid';

export const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/products" />} />
            <Route path="/products" element={<ProductGrid />} />
        </Routes>
    );
};
