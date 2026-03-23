import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { FieldConfig } from "./types";

export const FIELDS: FieldConfig[] = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Your username",
    icon: <FaUser />,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "your@email.com",
    icon: <FaEnvelope />,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
    icon: <FaPhone />,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    icon: <FaLock />,
  },
];
