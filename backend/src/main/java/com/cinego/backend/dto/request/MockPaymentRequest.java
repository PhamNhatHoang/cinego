package com.cinego.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class MockPaymentRequest {

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // e.g. "CREDIT_CARD", "MOMO", "BANK_TRANSFER"

    private String transactionNo;

    public MockPaymentRequest() {
    }

    public MockPaymentRequest(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionNo() {
        return transactionNo;
    }

    public void setTransactionNo(String transactionNo) {
        this.transactionNo = transactionNo;
    }
}
