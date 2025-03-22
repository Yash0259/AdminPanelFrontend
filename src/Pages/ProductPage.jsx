import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Snackbar, Alert } from "@mui/material";
import { Products } from "../Components/Products/Products";
import { ProductModal } from "../Components/Products/ProductModel";

const API_URL = import.meta.env.VITE_API_URL;

export const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });


    // Fetch products from API
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 2000);

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [products]); // Runs when products change


    // Open modal for creating a new product
    const handleOpenModal = () => {
        setSelectedProduct(null);
        setModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // Save product (POST request)
    const handleSaveProduct = async (formData) => {
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "images") {
                    value.forEach((image) => formDataToSend.append("images", image));
                } else {
                    formDataToSend.append(key, value);
                }
            });

            const response = await fetch(`${API_URL}/products`, {
                method: "POST",
                body: formDataToSend,
            });

            if (!response.ok) throw new Error("Failed to create product");

            const newProduct = await response.json();
            setProducts((prev) => [...prev, newProduct]); // Add new product to the list

            // Show success alert
            setSnackbar({ open: true, message: "Product created successfully!", severity: "success" });

            handleCloseModal(); // Close modal only after success
        } catch (error) {
            setSnackbar({ open: true, message: "Failed to create product", severity: "error" });
            console.error("Error creating product:", error);
        }
    };


    const handleProductUpdate = (productId, updatedProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId ? { ...product, ...updatedProduct } : product
            )
        );
    };



    const handleDeleteProduct = (productId) => {
        setProducts((prev) => prev.filter((product) => product.id !== productId)); // Remove from UI immediately
    };


    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: "1.4rem" }}>Product Grid</Typography>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1E90FF", color: "white", "&:hover": { backgroundColor: "#187bcd" } }}
                    onClick={handleOpenModal}
                >
                    + Create
                </Button>
            </Box>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {products.map((product, index) => (
                        <Grid item key={product.id || product.sku || index} xs={12} sm={6} md={4}>
                            <Products product={product} onEdit={handleProductUpdate} onDelete={handleDeleteProduct} />
                        </Grid>

                    ))}
                </Grid>
            </Box>


            {/* Product Modal */}
            <ProductModal
                open={modalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSaveProduct}
                productData={selectedProduct}
            />
            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
