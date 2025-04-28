document.addEventListener('DOMContentLoaded', function() {
    // Ticket Form Submission
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show summary and payment sections
            document.getElementById('pricingSummary').style.display = 'block';
            document.getElementById('paymentOptions').style.display = 'block';
            
            // Update pricing
            updatePricing();
            
            // Scroll to payment section
            document.getElementById('paymentOptions').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Pricing Calculation
    function updatePricing() {
        const ticketType = document.getElementById('ticket-type');
        const quantity = document.getElementById('quantity');
        const ticketRow = document.getElementById('ticketRow');
        const totalPrice = document.getElementById('totalPrice');
        const qrAmount = document.getElementById('qrAmount');

        const prices = {
            adult: 50,
            child: 20,
            student: 30,
            foreign: 200,
            senior: 0
        };
        
        const selectedTicket = ticketType.value;
        const ticketName = ticketType.options[ticketType.selectedIndex].text.split(' (')[0];
        const qty = parseInt(quantity.value) || 0;
        
        // Update ticket row
        if (ticketRow) {
            ticketRow.innerHTML = `
                <td>${ticketName}</td>
                <td>${qty}</td>
                <td>₹${prices[selectedTicket] * qty}</td>
            `;
        }
        
        // Update total
        if (totalPrice) {
            totalPrice.textContent = `₹${prices[selectedTicket] * qty}`;
        }

        // Update QR amount if it exists
        if (qrAmount) {
            qrAmount.textContent = `₹${prices[selectedTicket] * qty}`;
        }
    }

    // Initialize pricing on page load
    updatePricing();

    // Update pricing when inputs change
    document.getElementById('ticket-type')?.addEventListener('change', updatePricing);
    document.getElementById('quantity')?.addEventListener('change', updatePricing);

    // Payment Method Selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all payment forms
            document.getElementById('creditCardForm').style.display = 'none';
            document.getElementById('upiForm').style.display = 'none';
            document.getElementById('netBankingForm').style.display = 'none';
            document.getElementById('qrForm').style.display = 'none';
            
            // Show selected payment form
            const methodType = this.getAttribute('data-method');
            document.getElementById(`${methodType}Form`).style.display = 'block';
            
            // Special handling for QR code
            if (methodType === 'qr') {
                startQRPayment();
            }
        });
    });

    // QR Code Payment Functions
    function startQRPayment() {
        // Display the current total amount
        const totalPrice = document.getElementById('totalPrice').textContent;
        document.getElementById('qrAmount').textContent = totalPrice;
        
        // Generate a sample QR code
        const qrCodeDiv = document.getElementById('qrCodeDisplay');
        qrCodeDiv.innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI_PAYMENT_LINK_' + 
                             encodeURIComponent(totalPrice) + '" alt="Payment QR Code">';
        
        // Start the countdown
        let timeLeft = 10;
        const timerElement = document.getElementById('qrTimer');
        
        // Clear any existing timer
        if (window.qrTimerInterval) {
            clearInterval(window.qrTimerInterval);
        }
        
        timerElement.textContent = timeLeft;
        window.qrTimerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(window.qrTimerInterval);
                completeQRPayment();
            }
        }, 1000);
    }

    function completeQRPayment() {
        // Hide the QR form and show processing
        document.getElementById('qrForm').style.display = 'none';
        document.getElementById('paymentProcessing').style.display = 'block';
        
        // Simulate payment verification
        setTimeout(function() {
            document.getElementById('paymentProcessing').style.display = 'none';
            document.getElementById('paymentSuccess').style.display = 'block';
            
            document.getElementById('paymentSuccess').scrollIntoView({
                behavior: 'smooth'
            });
        }, 1500);
    }

    // Handle Credit Card and UPI form submissions
    function handlePaymentSubmission(e) {
        e.preventDefault();
        
        // Show processing animation
        document.getElementById('paymentOptions').style.display = 'none';
        document.getElementById('paymentProcessing').style.display = 'block';
        
        // Simulate payment processing (3 seconds)
        setTimeout(function() {
            document.getElementById('paymentProcessing').style.display = 'none';
            document.getElementById('paymentSuccess').style.display = 'block';
            
            // Scroll to success message
            document.getElementById('paymentSuccess').scrollIntoView({
                behavior: 'smooth'
            });
        }, 3000);
    }

    // Handle Net Banking form submission
    function handleNetBankingSubmission(e) {
        e.preventDefault();
        
        // Get selected bank
        const bankSelect = document.getElementById('bank');
        if (!bankSelect || bankSelect.value === "") {
            alert("Please select a bank");
            return;
        }
        
        const selectedBank = bankSelect.options[bankSelect.selectedIndex].text;
        
        // Show processing with bank info
        document.getElementById('paymentOptions').style.display = 'none';
        const processingElement = document.getElementById('paymentProcessing');
        processingElement.style.display = 'block';
        
        // Update processing message
        const processingText = processingElement.querySelector('p');
        if (processingText) {
            processingText.textContent = `Redirecting to ${selectedBank} Net Banking...`;
        }
        
        // Simulate bank redirect (3 seconds)
        setTimeout(function() {
            processingElement.style.display = 'none';
            const successElement = document.getElementById('paymentSuccess');
            successElement.style.display = 'block';
            
            // Update success message
            const successText = successElement.querySelector('p');
            if (successText) {
                successText.innerHTML = `Payment successful via ${selectedBank}!<br>
                     Your ticket will be sent to your email shortly.`;
            }
            
            successElement.scrollIntoView({
                behavior: 'smooth'
            });
        }, 3000);
    }

    // Attach submit handlers
    document.getElementById('creditCardForm')?.addEventListener('submit', handlePaymentSubmission);
    document.getElementById('upiForm')?.addEventListener('submit', handlePaymentSubmission);
    document.getElementById('netBankingForm')?.addEventListener('submit', handleNetBankingSubmission);

    // Initialize with credit card form visible
    document.getElementById('creditCardForm').style.display = 'block';
});