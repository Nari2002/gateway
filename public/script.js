document.getElementById('payment-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contact = document.getElementById('contact').value;
    const amount = document.getElementById('amount').value * 100; // Amount in smallest currency unit

    const receipt = 'receipt_' + new Date().getTime(); // Generating a unique receipt ID

    // Create order on the server
    const order = await fetch('/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, currency: 'INR', receipt })
    }).then(response => response.json());

    var options = {
        "key": "rzp_test_jg9oLeJD1FfZNT", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits
        "currency": order.currency,
        "name": "RK Foundation",
        "description": "Donation",
        "image": "https://example.com/your_logo", // Replace with your logo URL
        "order_id": order.id, // Use the order ID returned from your server
        "handler": function (response){
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);

            // Display the thank you note
            document.getElementById('thank-you').style.display = 'block';

            // Display the receipt and show the print button
            const receiptContent = document.getElementById('receipt-content');
            receiptContent.innerHTML = `
                <h1>Payment Receipt</h1>
                <p>Payment ID: ${response.razorpay_payment_id}</p>
                <p>Amount: INR ${amount / 100}</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Contact: ${contact}</p>
                <p>Thank you for your donation to RK Foundation!</p>
            `;
            document.getElementById('receipt-container').style.display = 'block';
        },
        "prefill": {
            "name": name,
            "email": email,
            "contact": contact
        },
        "notes": {
            "address": "RK Foundation"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
});

document.getElementById('print-receipt').addEventListener('click', function() {
    const printContent = document.getElementById('receipt-content').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
});
