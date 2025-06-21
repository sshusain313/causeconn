import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { sendInvoiceEmail } from './emailService';

interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  sponsor: {
    organizationName: string;
    contactName: string;
    email: string;
    phone: string;
  };
  cause: {
    title: string;
    description?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentId: string;
  orderId: string;
}

export const generateInvoicePDF = async (data: InvoiceData): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Create invoices directory if it doesn't exist
      const invoicesDir = path.join(uploadsDir, 'invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const fileName = `invoice-${data.invoiceNumber}-${Date.now()}.pdf`;
      const filePath = path.join(invoicesDir, fileName);
      
      const doc = new PDFDocument({ margin: 50 });

      // Pipe PDF to file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Add company header
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .text('CauseConnect', { align: 'center' });
      
      doc.fontSize(12)
         .font('Helvetica')
         .text('Making a difference, one tote at a time', { align: 'center' })
         .moveDown(0.5);

      // Add invoice details
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text('INVOICE')
         .moveDown(0.5);

      doc.fontSize(10)
         .font('Helvetica')
         .text(`Invoice #: ${data.invoiceNumber}`)
         .text(`Date: ${data.date.toLocaleDateString()}`)
         .text(`Due Date: ${data.dueDate.toLocaleDateString()}`)
         .text(`Payment ID: ${data.paymentId}`)
         .text(`Order ID: ${data.orderId}`)
         .moveDown(1);

      // Add sponsor information
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('Bill To:')
         .moveDown(0.5);

      doc.fontSize(10)
         .font('Helvetica')
         .text(data.sponsor.organizationName)
         .text(data.sponsor.contactName)
         .text(data.sponsor.email)
         .text(data.sponsor.phone)
         .moveDown(1);

      // Add cause information
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('Campaign:')
         .moveDown(0.5);

      doc.fontSize(10)
         .font('Helvetica')
         .text(data.cause.title)
         .moveDown(1);

      // Add items table
      const tableTop = doc.y;
      const itemCodeX = 50;
      const descriptionX = 150;
      const quantityX = 350;
      const unitPriceX = 420;
      const totalX = 500;

      // Table headers
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Item', itemCodeX, tableTop)
         .text('Description', descriptionX, tableTop)
         .text('Qty', quantityX, tableTop)
         .text('Unit Price', unitPriceX, tableTop)
         .text('Total', totalX, tableTop)
         .moveDown(0.5);

      // Table content
      let currentY = doc.y;
      data.items.forEach((item, index) => {
        doc.fontSize(10)
           .font('Helvetica')
           .text(`${index + 1}`, itemCodeX, currentY)
           .text(item.description, descriptionX, currentY)
           .text(item.quantity.toString(), quantityX, currentY)
           .text(`${data.currency} ${item.unitPrice.toFixed(2)}`, unitPriceX, currentY)
           .text(`${data.currency} ${item.total.toFixed(2)}`, totalX, currentY);
        
        currentY += 20;
      });

      doc.y = currentY + 20;

      // Add totals
      const totalsX = 400;
      doc.fontSize(10)
         .font('Helvetica')
         .text('Subtotal:', totalsX, doc.y)
         .text(`${data.currency} ${data.subtotal.toFixed(2)}`, totalX, doc.y)
         .moveDown(0.5);

      if (data.tax > 0) {
        doc.text('Tax:', totalsX, doc.y)
           .text(`${data.currency} ${data.tax.toFixed(2)}`, totalX, doc.y)
           .moveDown(0.5);
      }

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('Total:', totalsX, doc.y)
         .text(`${data.currency} ${data.total.toFixed(2)}`, totalX, doc.y)
         .moveDown(2);

      // Add payment information
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Payment Information:')
         .moveDown(0.5);

      doc.fontSize(10)
         .font('Helvetica')
         .text(`Payment Method: Razorpay`)
         .text(`Payment Status: Paid`)
         .text(`Payment Date: ${data.date.toLocaleDateString()}`)
         .moveDown(2);

      // Add footer
      doc.fontSize(8)
         .font('Helvetica')
         .text('Thank you for your support!', { align: 'center' })
         .text('For questions about this invoice, please contact support@causeconnect.org', { align: 'center' });

      // Finalize PDF
      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

export const generateAndSendInvoice = async (
  email: string,
  paymentData: {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    organizationName: string;
    contactName: string;
    phone: string;
    causeTitle: string;
    toteQuantity: number;
    unitPrice: number;
  }
): Promise<void> => {
  try {
    console.log('Generating invoice for payment:', paymentData.paymentId);

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Calculate dates
    const date = new Date();
    const dueDate = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Calculate totals
    const subtotal = paymentData.toteQuantity * paymentData.unitPrice;
    const tax = 0; // No tax for now
    const total = subtotal + tax;

    const invoiceData: InvoiceData = {
      invoiceNumber,
      date,
      dueDate,
      sponsor: {
        organizationName: paymentData.organizationName,
        contactName: paymentData.contactName,
        email,
        phone: paymentData.phone,
      },
      cause: {
        title: paymentData.causeTitle,
      },
      items: [
        {
          description: `Tote Bags for ${paymentData.causeTitle} Campaign`,
          quantity: paymentData.toteQuantity,
          unitPrice: paymentData.unitPrice,
          total: subtotal,
        },
      ],
      subtotal,
      tax,
      total,
      currency: paymentData.currency,
      paymentId: paymentData.paymentId,
      orderId: paymentData.orderId,
    };

    // Generate PDF
    const pdfPath = await generateInvoicePDF(invoiceData);
    console.log('Invoice PDF generated at:', pdfPath);

    // Send email with invoice
    await sendInvoiceEmail(email, {
      organizationName: paymentData.organizationName,
      causeTitle: paymentData.causeTitle,
      invoiceNumber,
      total: paymentData.amount / 100, // Convert from paise to rupees
      currency: paymentData.currency,
    }, pdfPath);

    console.log('Invoice sent successfully to:', email);

    // Clean up PDF file after sending (optional)
    setTimeout(() => {
      try {
        fs.unlinkSync(pdfPath);
        console.log('Invoice PDF cleaned up:', pdfPath);
      } catch (error) {
        console.log('Could not clean up invoice PDF:', error);
      }
    }, 60000); // Delete after 1 minute

  } catch (error) {
    console.error('Error generating and sending invoice:', error);
    throw error;
  }
}; 