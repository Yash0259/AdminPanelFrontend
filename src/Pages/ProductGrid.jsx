import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Snackbar, Alert } from '@mui/material';
import { ProductModal } from '../Components/Products/ProductModel';
import { Products } from '../Components/Products/Products';

const API_URL = import.meta.env.VITE_API_URL;

export const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                const data = await response.json();
                setProducts(data);
                console.log(data)
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to load products', severity: 'error' });
                console.error("Failed to load Products:", error);
            }
        };
        fetchProducts();
    }, []);

    // Handle Create Product
    const handleCreate = async (formData) => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("sku", formData.sku);
            formDataToSend.append("price", formData.price);

            // Append images
            formData.images.forEach((image) => {
                formDataToSend.append("images", image);
            });

            const response = await fetch(`${API_URL}/products`, {
                method: "POST",
                body: formDataToSend, // No need for 'Content-Type', browser sets it automatically
            });

            if (!response.ok) throw new Error("Failed to create product");

            setSnackbar({ open: true, message: 'Product created successfully!', severity: 'success' });
            setProducts([...products, formData]); // Optimistic update
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to create product', severity: 'error' });
            console.error("Failed to create Product:", error);
        }
        setOpenModal(false);
    };


    // Handle Edit Product
    const handleEdit = async (updatedData) => {
        if (!editProduct || !editProduct.id) {
            console.error("Invalid Product ID:", editProduct);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/products/${editProduct.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData), // Send only changed data
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Updated Product:", result);
                alert("Product updated successfully!");  // ✅ Show success popup
                setOpenModal(false);  // ✅ Close modal
            } else {
                throw new Error(result.message || "Failed to update product");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product: " + error.message); // Show error popup
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                <Typography sx={{ fontSize: "1.4rem" }}>Product Grid</Typography>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#1E90FF', color: 'white', '&:hover': { backgroundColor: '#187bcd' } }}
                    onClick={() => { setEditProduct(null); setOpenModal(true); }}
                >
                    + Create
                </Button>
            </Box>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {products.map((product, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Products
                                product={product}
                                onEdit={() => { setEditProduct(product); setOpenModal(true); }}
                                onDelete={(id) => setProducts(products.filter(p => p.id !== id))}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Product Modal */}
            <ProductModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                handleSave={(formData) => handleEdit({ id: editProduct.id, ...formData })}
                productData={editProduct}
            />

            {/* Snackbar for Alerts */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
