import { validateSignUpForm } from "../valid-signup";
import type { SignUpData } from "@/actions/types";

const validData: SignUpData = {
  username: "denys",
  email: "denys@example.com",
  phone: "+380671234567",
  password: "Password1",
  confirmPass: "Password1",
};

describe("valid-signup", () => {
  it("accepts a fully valid form", () => {
    expect(validateSignUpForm(validData)).toEqual({
      ok: true,
      data: validData,
    });
  });

  it("requires all fields when empty", () => {
    const result = validateSignUpForm({
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPass: "",
    });

    expect(result).toEqual({
      ok: false,
      errors: {
        username: "Username is required",
        email: "Email is required",
        phone: "Phone is required",
        password: "Password is required",
      },
    });
  });

  it("rejects mismatched password confirmation", () => {
    const result = validateSignUpForm({
      ...validData,
      confirmPass: "Different1",
    });

    expect(result).toEqual({
      ok: false,
      errors: { confirmPass: "Passwords do not match" },
    });
  });

  it("rejects an invalid email", () => {
    const result = validateSignUpForm({ ...validData, email: "not-an-email" });

    expect(result).toEqual({
      ok: false,
      errors: { email: "Email not valid!" },
    });
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = validateSignUpForm({
      ...validData,
      password: "Pass1",
      confirmPass: "Pass1",
    });

    expect(result).toEqual({
      ok: false,
      errors: { password: "Password must be at least 8 characters" },
    });
  });
});
