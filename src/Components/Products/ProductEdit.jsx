import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export const ProductEdit = ({ open, handleClose, handleUpdate, product }) => {
  const [formData, setFormData] = useState({});
  const [changedFields, setChangedFields] = useState({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setChangedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(changedFields).length > 0) {
      handleUpdate(changedFields);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <TextField label="Name" name="name" value={formData.name || ""} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField label="SKU" name="sku" value={formData.sku || ""} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField label="Price" name="price" value={formData.price || ""} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
};
