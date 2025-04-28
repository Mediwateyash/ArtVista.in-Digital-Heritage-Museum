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
            showPaymentSuccess('qr');
        }, 1500);
    }

    // Show Payment Success with Ticket
    function showPaymentSuccess(paymentMethod) {
        document.getElementById('paymentProcessing').style.display = 'none';
        document.getElementById('paymentSuccess').style.display = 'block';
        
        // Generate ticket
        generateTicket(paymentMethod);
        
        document.getElementById('paymentSuccess').scrollIntoView({
            behavior: 'smooth'
        });
    }

    // Generate Ticket Function
    function generateTicket(paymentMethod) {
        // Get form data
        const visitDate = document.getElementById('visit-date').value;
        const ticketType = document.getElementById('ticket-type').value;
        const quantity = document.getElementById('quantity').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const totalPrice = document.getElementById('totalPrice').textContent;
        
        // Format date
        const formattedDate = new Date(visitDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Generate random ticket number and transaction ID
        const ticketNumber = 'AV' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
        const transactionId = 'TXN' + Math.floor(100000 + Math.random() * 900000);
        
        // Map ticket types to display names
        const ticketTypeNames = {
            adult: 'Adult',
            child: 'Child (5-12 yrs)',
            student: 'Student',
            foreign: 'Foreign Tourist',
            senior: 'Senior Citizen'
        };
        
        // Update ticket elements
        document.getElementById('ticketNumber').textContent = ticketNumber;
        document.getElementById('ticketVisitDate').textContent = formattedDate;
        document.getElementById('ticketVisitorName').textContent = name;
        document.getElementById('ticketType').textContent = ticketTypeNames[ticketType] || ticketType;
        document.getElementById('ticketQuantity').textContent = quantity;
        document.getElementById('ticketAmount').textContent = totalPrice;
        document.getElementById('ticketPaymentMethod').textContent = paymentMethod === 'qr' ? 'QR Payment' : 
            paymentMethod === 'upi' ? 'UPI' :
            paymentMethod === 'netbanking' ? 'Net Banking' : 'Credit Card';
        document.getElementById('ticketTransactionId').textContent = transactionId;
        document.getElementById('ticketEmail').textContent = email;
        
        // Generate QR code for ticket
        const qrData = `ArtVasta Ticket|${ticketNumber}|${name}|${formattedDate}|${totalPrice}`;
        document.getElementById('ticketQrCode').innerHTML = `
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}" 
                 alt="Ticket QR Code" width="150" height="150">
        `;
    }

    // Print Ticket Function
    window.printTicket = function() {
        window.print();
    }

    // Download Ticket Function
    window.downloadTicket = function() {
        // In a real app, this would generate a PDF
        alert("In a real application, this would generate and download a PDF ticket");
    }

    // Handle Credit Card and UPI form submissions
    function handlePaymentSubmission(e) {
        e.preventDefault();
        document.getElementById('paymentOptions').style.display = 'none';
        document.getElementById('paymentProcessing').style.display = 'block';
        
        const method = document.querySelector('.payment-method.active').getAttribute('data-method');
        
        setTimeout(function() {
            showPaymentSuccess(method);
        }, 3000);
    }

    // Handle Net Banking form submission
    function handleNetBankingSubmission(e) {
        e.preventDefault();
        const bankSelect = document.getElementById('bank');
        if (!bankSelect || bankSelect.value === "") {
            alert("Please select a bank");
            return;
        }
        
        document.getElementById('paymentOptions').style.display = 'none';
        document.getElementById('paymentProcessing').style.display = 'block';
        
        setTimeout(function() {
            showPaymentSuccess('netbanking');
        }, 3000);
    }

    // Attach submit handlers
    document.getElementById('creditCardForm')?.addEventListener('submit', handlePaymentSubmission);
    document.getElementById('upiForm')?.addEventListener('submit', handlePaymentSubmission);
    document.getElementById('netBankingForm')?.addEventListener('submit', handleNetBankingSubmission);

    // Initialize with credit card form visible
    document.getElementById('creditCardForm').style.display = 'block';
});