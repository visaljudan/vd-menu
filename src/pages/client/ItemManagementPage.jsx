import React from "react";
import { Card, CardContent, CardMedia, Typography, Chip, Box } from "@mui/material";

const items = [
  {
    categoryId: "1",
    name: "Item Name",
    description: "This is a sample description.",
    price: 20,
    image: "https://via.placeholder.com/150",
    meta: {},
    tags: ["Tag1", "Tag2"],
    status: "active",
  },
];

const ItemsList = () => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {items.map((item, index) => (
        <Card key={index} sx={{ maxWidth: 345 }}>
          <CardMedia component="img" height="140" image={item.image} alt={item.name} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
            <Typography variant="h6" color="primary">
              ${item.price}
            </Typography>
            <Box mt={1} display="flex" gap={1}>
              {item.tags.map((tag, idx) => (
                <Chip key={idx} label={tag} />
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ItemsList;
