import { Metadata } from "next";
import Image from "next/image";

import "./about.scss";

export const metadata: Metadata = {
  title: "About funny page",
  description: "This about page funny site.",
};

export default async function ProductsPage() {
  return (
    <div className="about_page">
      <h1 className="about_title">About Funny Site</h1>
      <div className="about_content">
        <Image
          className="about_img"
          src="/next-JS-framework.png"
          width={800}
          height={500}
          alt="next-JS-framework"
          priority
        />
        <div className="about_tech">
          <p className="about_text">Technologies used:</p>
          <ul className="about_list">
            <li>Next.js</li>
            <li>React (version 19+)</li>
            <li>Redux Toolkit</li>
            <li>Redux Persist</li>
            <li>Herou UI</li>
            <li>TypeScript</li>
            <li>SCSS</li>
            <li>CSS</li>
            <li>Hooks</li>
            <li>Context</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
