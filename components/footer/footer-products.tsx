"use server";
import Image from "next/image";
import Link from "next/link";

import "./footer-products.scss";

const Footer = () => {
  return (
    <div className="container">
      <footer className="footer">
        <div className="footer_content">
          <ul className="footer_list-links">
            <li className="nav-item">
              <Link href={"/"}>
                <Image
                  style={{ maxWidth: "30px !important" }}
                  src="/favicon.png"
                  alt="logo funny shop"
                  width={30}
                  height={30}
                  loading="lazy"
                  // priority
                />
              </Link>
            </li>
            <li className="nav-item">
              <Link href={"/"}>Home</Link>
            </li>
            <li className="nav-item">
              <Link href={"/products"}>Products</Link>
            </li>
            <li className="nav-item">
              <Link href={"/cart"}>Cart</Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="">
                FAQs
              </Link>
            </li>
            <li className="nav-item">
              <Link href={"/about"}> About</Link>
            </li>
          </ul>
          <div className="line"></div>
          <div className="footer_bottom">
            <div className="create_name">
              <p>© 2025 Harchev Denys | Coded with 💜</p>
            </div>
            <ul className="footer_list-icons">
              <li>
                <Link href="" target="_blank">
                  <Image
                    src="/social/twitter-logo-svgrepo-com.svg"
                    alt="twitter"
                    style={{ maxWidth: "30px" }}
                    width={30}
                    height={30}
                    loading="lazy"
                  />
                </Link>
              </li>
              <li>
                <Link href="https://ua.linkedin.com/" target="_blank">
                  <Image
                    src="/social/linkedin-rounded-svgrepo-com.svg"
                    alt="linkedin"
                    style={{ maxWidth: "30px" }}
                    width={30}
                    height={30}
                    loading="lazy"
                  />
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" target="_blank">
                  <Image
                    src="/social/instagram-rounded-svgrepo-com.svg"
                    alt="Instagram"
                    style={{ maxWidth: "30px" }}
                    width={30}
                    height={30}
                    loading="lazy"
                  />
                </Link>
              </li>
              <li>
                <Link href="https://github.com/DenisFR2727" target="_blank">
                  <Image
                    src="/social/github-svgrepo-com.svg"
                    alt="github"
                    style={{ maxWidth: "30px" }}
                    width={30}
                    height={30}
                    loading="lazy"
                  />
                </Link>
              </li>
              <li>
                <Link href="https://www.facebook.com/" target="_blank">
                  <Image
                    src="/social/facebook-svgrepo-com.svg"
                    alt="facebook"
                    style={{ maxWidth: "30px" }}
                    width={30}
                    height={30}
                    loading="lazy"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
