import React, { useState } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Collapse,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

// Import your Visa and MasterCard images
import visaImage from '../assets/visa.png'; // Replace with the actual path to your Visa image
import mastercardImage from '../assets/mastercard.png'; // Replace with the actual path to your MasterCard image
import qrImage from '../assets/QR.png'; // Replace with the actual path to your QR image

function PaymentSubscription() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [creditCardDetails, setCreditCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [khqrImage, setKhqrImage] = useState(null);
  const [isCreditCardVisible, setIsCreditCardVisible] = useState(false);
  const [isKHQRVisible, setIsKHQRVisible] = useState(false);

  const handlePaymentMethodChange = (event) => {
    const value = event.target.value;
    setSelectedPaymentMethod(value);
    setIsCreditCardVisible(value === 'credit_card');
    setIsKHQRVisible(value === 'khqr');
  };

  const handleCreditCardChange = (event) => {
    const { name, value } = event.target;
    setCreditCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubscribe = () => {
    if (selectedPaymentMethod === 'visa') {
      alert('Processing Visa payment...');
    } else if (selectedPaymentMethod === 'khqr') {
      alert('Initiating KHQR payment...');
    } else if (selectedPaymentMethod === 'credit_card') {
      alert(
        `Processing credit card: ****-****-****-${creditCardDetails.cardNumber.slice(-4)}`
      );
    } else {
      alert('Please select a payment method.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Subscription Payment
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Premium Plan
          </Typography>
          <Typography variant="subtitle1" color="success">
            Price: $9.99 / month
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enjoy all the premium features with this plan.
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Select Payment Method
      </Typography>
      <RadioGroup
        aria-label="payment-method"
        name="payment_method"
        value={selectedPaymentMethod}
        onChange={handlePaymentMethodChange}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                value="visa"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={visaImage} alt="Visa" style={{ height: 24, marginRight: 8 }} />
                    <Typography>Visa</Typography>
                  </Box>
                }
                sx={{ mr: 0 }}
              />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                value="credit_card"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={mastercardImage} alt="MasterCard" style={{ height: 24, marginRight: 8 }} />
                    <Typography>MasterCard</Typography>
                  </Box>
                }
                sx={{ mr: 0 }}
              />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                value="khqr"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={qrImage} alt="KHQR" style={{ height: 24, marginRight: 8 }} />
                    <Typography>KHQR</Typography>
                  </Box>
                }
                sx={{ mr: 0 }}
              />
            </Card>
          </Grid>
        </Grid>
      </RadioGroup>

      <Collapse in={isKHQRVisible}>
        <Card sx={{ mt: 2, p: 2 }}>
          <Typography variant="body1" gutterBottom>
            Scan the QR code below with your mobile banking app to complete the
            payment.
          </Typography>
          {khqrImage ? (
            <img src={khqrImage} alt="KHQR Code" style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '10px auto' }} />
          ) : (
            <Typography variant="caption" display="block" color="text.secondary">
              (QR code will be displayed here)
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Once scanned, please follow the instructions in your banking app to
            authorize the payment.
          </Typography>
        </Card>
      </Collapse>

      <Collapse in={isCreditCardVisible}>
        <Card sx={{ mt: 2, p: 2 }}>
          <TextField
            fullWidth
            label="Card Number"
            name="cardNumber"
            value={creditCardDetails.cardNumber}
            onChange={handleCreditCardChange}
            margin="normal"
            variant="outlined"
            placeholder="XXXX-XXXX-XXXX-XXXX"
          />
          <TextField
            label="Expiry Date (MM/YY)"
            name="expiryDate"
            value={creditCardDetails.expiryDate}
            onChange={handleCreditCardChange}
            margin="normal"
            variant="outlined"
            placeholder="MM/YY"
            sx={{ width: '50%', mr: 1 }}
          />
          <TextField
            label="CVV"
            name="cvv"
            value={creditCardDetails.cvv}
            onChange={handleCreditCardChange}
            margin="normal"
            variant="outlined"
            placeholder="123"
            sx={{ width: '48%' }}
          />
        </Card>
      </Collapse>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubscribe}
        sx={{ mt: 3 }}
        disabled={!selectedPaymentMethod}
      >
        Subscribe Now
      </Button>
    </Box>
  );
}

export default PaymentSubscription;