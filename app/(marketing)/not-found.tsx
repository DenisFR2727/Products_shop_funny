import Link from "next/link";

import "@/styles/globals.css";

export default function NotFound() {
  return (
    <div className="not_found-product">
      <h1>Not Found Product!</h1>
      <p>Error Page</p>
      <div className="go_home-link">
        <Link href="/">Go Home</Link>
      </div>
    </div>
  );
}
