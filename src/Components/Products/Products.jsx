import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ProductEdit } from "./ProductEdit";

const defaultImage = "https://placehold.co/300x200?text=No+Image";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Products = ({ product, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  const images = product.images?.length ? product.images : [defaultImage];

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;

    try {
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/${product.id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete product");

      onDelete(product.id);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };


  const handleOpenEdit = () => {
    setEditedProduct(product); // Set product data for editing
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditedProduct(null);
  };

  const handleUpdate = async (updatedFields) => {
    if (!product || !product.id) {
      console.error("Product ID is missing!");
      alert("Product ID is missing!");
      return;
    }

    try {
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) throw new Error("Failed to update product");

      const updatedProduct = await response.json();

      if (typeof onEdit === "function") {
        onEdit(product.id, updatedProduct); // Ensure `onEdit` updates the state correctly
      } else {
        console.error("onEdit is not defined or not a function!");
      }

      handleCloseEdit();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };



  return (
    <>
      <Card sx={{ maxWidth: 300, borderRadius: 2, boxShadow: 2, position: "relative" }}>
        <div style={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="180"
            image={images[currentImageIndex]}
            alt={`Product Image ${currentImageIndex + 1}`}
            onError={(e) => (e.target.src = defaultImage)}
            sx={{ objectFit: "cover" }}
          />
          <IconButton
            sx={{
              position: "absolute",
              top: "50%",
              left: 5,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
            }}
            onClick={handlePrevImage}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          <IconButton
            sx={{
              position: "absolute",
              top: "50%",
              right: 5,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
            }}
            onClick={handleNextImage}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </div>

        <CardContent sx={{ p: 0.5 }}>
          <Typography gutterBottom variant="h6" fontWeight="bold" sx={{ mb: 0, fontSize: "1rem" }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.1 }}>
            <strong>SKU:</strong> {product.sku}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.1 }}>
            <strong>Price:</strong> ${product.price}
          </Typography>
        </CardContent>

        <CardActions sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
          <Button onClick={handleOpenEdit}>Edit</Button>

          <Button variant="contained" color="error" size="small" onClick={handleDelete}>
            Delete
          </Button>
        </CardActions>
      </Card>

      {editOpen && (
        <ProductEdit
          open={editOpen}
          handleClose={handleCloseEdit}
          handleUpdate={handleUpdate}
          product={editedProduct}
        />
      )}
    </>
  );
};
