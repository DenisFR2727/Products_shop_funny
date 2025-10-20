import Link from "next/link";
import BackDropNav from "../products/nav-link-backdrop";

import "./details-nav.scss";

export default function DetailsNav() {
  return (
    <nav className="nav-details">
      <ul>
        <div className="details-link">
          <li className="link-item-line">
            <Link href={`/`}>Home</Link>
          </li>
          <li>
            <img src="/arrow_forward_next_right.svg" alt="arrow" />
          </li>
          <li className="link-item-line">
            <Link href={`/products`}>Products</Link>
          </li>
        </div>
        <div className="link-item-line">
          <BackDropNav>Back</BackDropNav>
        </div>
      </ul>
    </nav>
  );
}
