import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

export const ProductModal = ({ open, handleClose, handleSave, productData }) => {
  const [formData, setFormData] = useState({ name: "", sku: "", price: "", images: [] });

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || "",
        sku: productData.sku || "",
        price: productData.price || "",
        images: productData.images || [],
      });
    }
  }, [productData]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  // Remove Selected Image
  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{productData ? "Edit Product" : "Create Product"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Typography>
          Allowed Image Format : "jpeg","png","jpg"
        </Typography>
        {/* Image Upload */}
        <Box sx={{ mt: 2 }}>
          <input type="file" multiple onChange={handleImageUpload} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {formData.images.map((img, index) => {
              const imageUrl = img instanceof Blob ? URL.createObjectURL(img) : img;
              return (
                <Box key={index} sx={{ position: "relative" }}>
                  <img
                    src={imageUrl}
                    alt={`Uploaded ${index}`}
                    width={60}
                    height={60}
                    style={{ borderRadius: 5, border: "1px solid #ddd" }}
                  />
                  <Button
                    size="small"
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    ❌
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={() => handleSave(formData)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
