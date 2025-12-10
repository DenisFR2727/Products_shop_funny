import Link from "next/link";
import "./thanks.scss";
export default async function ThanksPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <div className="thanks_page">
      <h2>Thanks you for your purchase</h2>
      <p>
        ORDER NO. <span className="thanks_order">{orderId}</span>
      </p>
      <p>WE WILL SEND YOU ANOTHER EMAIL WHEN IT IS IN TRANSIT</p>
      <Link href="/products">
        <span className="thanks_btn">Return Products</span>
      </Link>
    </div>
  );
}
