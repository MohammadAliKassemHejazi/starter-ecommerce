import { describe, test, expect } from "bun:test";
import { validateField, validateForm, commonRules, patterns, type ValidationRule } from "./validation";

describe("Validation Utils", () => {
  describe("validateField", () => {
    test("should return 'This field is required' when required rule is true and value is empty", () => {
      const rule: ValidationRule = { required: true };
      expect(validateField("", rule)).toBe("This field is required");
      expect(validateField(null, rule)).toBe("This field is required");
      expect(validateField(undefined, rule)).toBe("This field is required");
      expect(validateField("   ", rule)).toBe("This field is required");
    });

    test("should return null when value is provided and required rule is true", () => {
      const rule: ValidationRule = { required: true };
      expect(validateField("valid", rule)).toBeNull();
      expect(validateField(0, rule)).toBeNull();
      expect(validateField(false, rule)).toBeNull();
    });

    test("should skip other validations if value is empty and not required", () => {
      const rule: ValidationRule = { minLength: 5 };
      expect(validateField("", rule)).toBeNull();
      expect(validateField(null, rule)).toBeNull();
      expect(validateField(undefined, rule)).toBeNull();
    });

    test("should validate minLength", () => {
      const rule: ValidationRule = { minLength: 5 };
      expect(validateField("1234", rule)).toBe("Minimum length is 5 characters");
      expect(validateField("12345", rule)).toBeNull();
    });

    test("should validate maxLength", () => {
      const rule: ValidationRule = { maxLength: 5 };
      expect(validateField("123456", rule)).toBe("Maximum length is 5 characters");
      expect(validateField("12345", rule)).toBeNull();
    });

    test("should validate pattern", () => {
      const rule: ValidationRule = { pattern: /^\d+$/ };
      expect(validateField("abc", rule)).toBe("Invalid format");
      expect(validateField("123", rule)).toBeNull();
    });

    test("should run custom validation function", () => {
      const customFn = (value: any) => (value === "fail" ? "Custom Error" : null);
      const rule: ValidationRule = { custom: customFn };
      expect(validateField("fail", rule)).toBe("Custom Error");
      expect(validateField("pass", rule)).toBeNull();
    });
  });

  describe("commonRules", () => {
    describe("email", () => {
      const rule = commonRules.email;

      test("should be required", () => {
        expect(validateField("", rule)).toBe("This field is required");
      });

      test("should validate format via pattern", () => {
         expect(validateField("invalid-email", rule)).toBe("Invalid format");
      });

      test("should validate format via custom function", () => {
         expect(validateField("test@example", rule)).toBe("Invalid format");
         expect(validateField("test@example.com", rule)).toBeNull();
      });
    });

    describe("password", () => {
      const rule = commonRules.password;

      test("should be required", () => {
        expect(validateField("", rule)).toBe("This field is required");
      });

      test("should validate minLength", () => {
        expect(validateField("Aa1", rule)).toBe("Minimum length is 6 characters");
      });

      test("should validate complexity via custom function", () => {
         expect(validateField("abcdef", rule)).toBe("Password must contain at least one uppercase letter");
         expect(validateField("ABCDEF", rule)).toBe("Password must contain at least one lowercase letter");
         expect(validateField("Abcdef", rule)).toBe("Password must contain at least one number");
         expect(validateField("Abcdef1", rule)).toBeNull();
      });
    });

    describe("phone", () => {
      const rule = commonRules.phone;

      test("should validate format", () => {
        expect(validateField("abc", rule)).toBe("Invalid format");
        expect(validateField("1234567890", rule)).toBeNull();
      });
    });

    describe("price", () => {
      const rule = commonRules.price;

      test("should be required", () => {
         expect(validateField("", rule)).toBe("This field is required");
      });

      test("should validate format", () => {
        expect(validateField("abc", rule)).toBe("Invalid format");
        expect(validateField("-10", rule)).toBe("Invalid format");
        expect(validateField("10.999", rule)).toBe("Invalid format");
        expect(validateField("10.50", rule)).toBeNull();
      });
    });

    describe("url", () => {
       const rule = commonRules.url;
       test("should validate url", () => {
          expect(validateField("htt://bad", rule)).toBe("Invalid format");
          expect(validateField("https://google.com", rule)).toBeNull();
       });
    });
  });

  describe("validateForm", () => {
     test("should validate entire form object", () => {
        const data = {
           email: "bad-email",
           password: "short"
        };
        const rules = {
           email: commonRules.email,
           password: commonRules.password
        };

        const errors = validateForm(data, rules);
        expect(errors.email).toBe("Invalid format");
        expect(errors.password).toBe("Minimum length is 6 characters");
     });

     test("should return empty object for valid form", () => {
        const data = {
           email: "test@example.com",
           password: "Password1"
        };
        const rules = {
           email: commonRules.email,
           password: commonRules.password
        };

        const errors = validateForm(data, rules);
        expect(Object.keys(errors).length).toBe(0);
     });
  });

  describe("Edge Cases", () => {
      test("should handle numeric 0 as valid value for required fields", () => {
          expect(validateField(0, { required: true })).toBeNull();
      });

      test("should handle boolean false as valid value for required fields", () => {
         expect(validateField(false, { required: true })).toBeNull();
      });
  });
});
