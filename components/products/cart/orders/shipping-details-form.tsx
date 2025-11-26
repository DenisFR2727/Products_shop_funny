import "./shipping-details.scss";

export default function ShippingForm() {
  return (
    <div className="shipping">
      <h2>Shipping Details</h2>
      <form>
        <div className="title_name">
          <div className="shipping_title">
            <label htmlFor="title">Title</label>
            <input type="text" placeholder="Mr." />
          </div>
          <div className="shipping_name">
            <label htmlFor="name">First Name</label>
            <input type="text" placeholder="Name" />
          </div>
          <div className="shipping_last-name">
            <label htmlFor="last_name">Last Name</label>
            <input type="text" placeholder="Last Name" />
          </div>
        </div>
        <div className="shipping_address">
          <label htmlFor="address">Address</label>
          <input type="text" placeholder="address" />
        </div>
        <div className="shipping_country">
          <div className="shipping_country-item">
            <label htmlFor="address">Country</label>
            <input type="text" placeholder="country" />
          </div>
          <div className="shipping_zip-item">
            <label htmlFor="address">Zip Code</label>
            <input type="text" placeholder="code" />
          </div>
        </div>
      </form>
    </div>
  );
}
