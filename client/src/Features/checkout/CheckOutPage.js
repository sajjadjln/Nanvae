import React, { useState } from "react";
import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FormProvider, useForm } from 'react-hook-form';

const steps = ["Shipping address", "Review your order", "Payment details"];

function getStepContent(step) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <Review />;
        case 2:
            return <PaymentForm />;
        default:
            throw new Error("Unknown step");
    }
}

export default function CheckoutPage() {
    const [activeStep, setActiveStep] = useState(0);
    const methods = useForm();
    const handleNext = (data) => {
        if (activeStep === 0) {
            console.log(data);
        }
        setActiveStep((activeStep) => activeStep + 1)
    };
    const handleBack = () => setActiveStep((activeStep) => activeStep - 1);

    return (
        <FormProvider {...methods}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <>
                    {activeStep === steps.length ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                Thank you for your order.
                            </Typography>
                            <Typography variant="subtitle1">
                                Your order number is #2222. We have not emailed your order confirmation,
                                and will not send you an update when your order has shipped as this is a fake store!
                            </Typography>
                        </>
                    ) : (
                        <form onSubmit={methods.handleSubmit(handleNext)}>
                            {getStepContent(activeStep)}
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                        Back
                                    </Button>
                                )}
                                <Button variant="contained" type='submit' sx={{ mt: 3, ml: 1 }}>
                                    {activeStep === steps.length - 1 ? "Place order" : "Next"}
                                </Button>
                            </Box>
                        </form>
                    )}
                </>
            </Paper>
        </FormProvider>
    );

}
