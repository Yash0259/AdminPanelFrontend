import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const defaultImage = "https://via.placeholder.com/300x200?text=No+Image";
const API_URL = import.meta.env.VITE_API_URL;

export const Products = ({ product, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const images = product.images?.length ? product.images : [defaultImage];

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;
    try {
      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      onDelete(product.id);
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <Card sx={{ maxWidth: 300, borderRadius: 2, boxShadow: 2, position: "relative" }}>
      {/* Image Section with Navigation Arrows */}
      <div style={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={imageErrors[currentImageIndex] ? defaultImage : images[currentImageIndex]}
          alt={`Product Image ${currentImageIndex + 1}`}
          onError={() => handleImageError(currentImageIndex)}
          sx={{ objectFit: "cover" }}
        />
        <IconButton
          sx={{ position: "absolute", top: "50%", left: 5, transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.5)", color: "white" }}
          onClick={handlePrevImage}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <IconButton
          sx={{ position: "absolute", top: "50%", right: 5, transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.5)", color: "white" }}
          onClick={handleNextImage}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </div>

      {/* Product Details */}
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

      {/* Action Buttons */}
      <CardActions sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
        <Button variant="contained" color="primary" size="small" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="contained" onClick={handleDelete} sx={{ bgcolor: "red", color: "white" }} size="small">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
