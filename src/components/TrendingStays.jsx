import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const TrendingStays = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return <Typography>No properties found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Properties
      </Typography>
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.property_id}>
            <Card>
              <Box sx={{ position: 'relative', pt: '56.25%' }}>
                <img
                  src={property.image[0]} // Display first image from array
                  alt={property.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {property.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {property.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${property.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {property.property_type}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrendingStays;
