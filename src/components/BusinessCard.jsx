import React from "react";
import { Paper, Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Edit, DeleteTwoTone, Business } from "@mui/icons-material";
import { useNavigate, useNavigation } from "react-router-dom";

const BusinessCard = ({
  id,
  name,
  description,
  location,
  photo,
  logo,
  companyName,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  return (
    <Tooltip title="View">
      <Paper
        onClick={() => navigate(`/menu/${id}`)}
        elevation={3}
        sx={{
          width: 300,
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          "&:hover .card-actions": {
            opacity: 1,
          },
        }}
      >
        <Box
          className="card-actions"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            opacity: 0,
            transition: "opacity 0.2s ease",
          }}
        >
          <Tooltip title="Edit">
            <IconButton
              onClick={() => onEdit(id)}
              size="small"
              sx={{ backgroundColor: "rgba(255,255,255,0.8)", mr: 1 }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => onDelete(id)}
              size="small"
              sx={{ backgroundColor: "rgba(255,255,255,0.8)" }}
              color="error"
            >
              <DeleteTwoTone fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Rest of your card content */}
        <Box sx={{ position: "relative", height: 150 }}>
          <img
            src={photo}
            alt="Business"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -24,
              left: 16,
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid white",
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ p: 2, pt: 4 }}>
          <Typography variant="h6" component="h3" noWrap>
            {companyName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} noWrap>
            {description}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {location}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default BusinessCard; // This is the crucial change
