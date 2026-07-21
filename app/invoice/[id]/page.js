import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import PrintButton from "@/app/components/PrintButton";
import { getStoreSettings } from "@/app/actions/store-actions";
import Image from "next/image";

export default async function InvoicePage({ params }) {
  const { id } = await params;
  const session = await getSession();
  
  if (!session?.userId) {
    redirect("/account");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { name: true, sku: true } }
        }
      },
      address: true,
      user: true,
    }
  });

  if (!order || (order.userId !== session.userId && session.role !== "ADMIN")) {
    notFound();
  }

  const settings = await getStoreSettings();

  return (
    <>
      {/* Hide all layout chrome on invoice page */}
      <style>{`
        #site-header, #site-footer, #site-notifications,
        .nextjs-toploader, #nprogress {
          display: none !important;
        }
        main.flex-1 { flex: none !important; }
        body { min-height: auto !important; }

        @media print {
          @page { size: A4; margin: 12mm 14mm; }
          html, body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .invoice-page { box-shadow: none !important; padding: 0 !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100 py-6 sm:py-10 print:bg-white print:py-0 print:min-h-0">
        <div className="invoice-page max-w-[720px] mx-auto bg-white p-6 sm:p-8 shadow-md print:shadow-none print:p-0">
          
          {/* ── Header: Logo + Invoice Info ── */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-brand-brown mb-4">
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="Thar Delight" width={56} height={56} className="object-contain" />
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-brown leading-tight">{settings?.businessName || "Thar Delight"}</h2>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{settings?.address || "12, Desert Crafts Plaza, Jodhpur, Rajasthan 342001"}</p>
                {settings?.gstNumber && <p className="text-[11px] text-gray-500">GSTIN: {settings.gstNumber}</p>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <h1 className="text-2xl font-serif font-bold text-brand-brown tracking-wide">INVOICE</h1>
              <p className="text-[11px] text-gray-500 mt-1">
                <span className="font-semibold text-brand-brown">#{order.id.slice(0,8).toUpperCase()}</span>
              </p>
              <p className="text-[11px] text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* ── Billing + Shipping in compact row ── */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-[12px]">
            <div className="bg-gray-50 rounded-lg p-3 print:bg-gray-50">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1.5">Bill To</h3>
              <p className="font-semibold text-brand-brown text-[13px]">{order.user.name}</p>
              <p className="text-gray-600">{order.user.email}</p>
              {order.address.phone && <p className="text-gray-600">{order.address.phone}</p>}
            </div>
            <div className="bg-gray-50 rounded-lg p-3 print:bg-gray-50">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1.5">Ship To</h3>
              <p className="font-semibold text-brand-brown text-[13px]">{order.address.fullName}</p>
              <p className="text-gray-600">{order.address.addressLine1}</p>
              <p className="text-gray-600">{order.address.city}, {order.address.state} {order.address.pincode}</p>
            </div>
          </div>

          {/* ── Items Table (compact) ── */}
          <table className="w-full text-[12px] mb-4">
            <thead>
              <tr className="bg-brand-brown text-white print:bg-brand-brown">
                <th className="py-2 px-3 text-left font-semibold rounded-tl-lg">#</th>
                <th className="py-2 px-3 text-left font-semibold">Item</th>
                <th className="py-2 px-3 text-center font-semibold">Qty</th>
                <th className="py-2 px-3 text-right font-semibold">Rate</th>
                <th className="py-2 px-3 text-right font-semibold rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 print:bg-gray-50"}>
                  <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                  <td className="py-2 px-3">
                    <p className="font-medium text-brand-brown leading-tight">{item.product.name}</p>
                    <p className="text-[10px] text-gray-400">SKU: {item.product.sku}</p>
                  </td>
                  <td className="py-2 px-3 text-center text-brand-brown font-medium">{item.quantity}</td>
                  <td className="py-2 px-3 text-right text-gray-600">₹{item.price.toLocaleString("en-IN")}</td>
                  <td className="py-2 px-3 text-right font-semibold text-brand-brown">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Totals (right-aligned, compact) ── */}
          <div className="flex justify-end mb-4">
            <div className="w-64 text-[12px]">
              <div className="flex justify-between py-1.5 text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-brand-brown">₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-1.5 text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{order.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 text-gray-600">
                <span>Delivery</span>
                <span className="font-medium text-brand-brown">
                  {order.deliveryCharge > 0 ? `₹${order.deliveryCharge.toLocaleString("en-IN")}` : "FREE"}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between py-1.5 text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-brand-brown">₹{order.tax.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between py-2 mt-1 border-t-2 border-brand-brown font-bold text-brand-brown text-sm">
                <span>Total</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* ── Payment + Contact row ── */}
          <div className="grid grid-cols-2 gap-4 text-[11px] text-gray-500 border-t border-gray-200 pt-3 mb-3">
            <div>
              <p><span className="font-semibold text-gray-600">Payment:</span> {order.paymentStatus}</p>
              <p><span className="font-semibold text-gray-600">Order Status:</span> {order.orderStatus}</p>
            </div>
            <div className="text-right">
              <p>{settings?.supportEmail || "hello@thardelight.com"}</p>
              <p>{settings?.supportPhone || "+91 98765 43210"}</p>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="text-center text-[10px] text-gray-400 border-t border-gray-100 pt-2">
            <p className="font-medium text-gray-500">Thank you for shopping with Thar Delight!</p>
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
          </div>

          {/* Print Button */}
          <div className="mt-6 text-center print:hidden">
            <PrintButton />
          </div>
        </div>
      </div>
    </>
  );
}
