import { describe, expect, it } from "bun:test";
import customError, { CustomError } from "./customError";

describe("CustomError Utility", () => {
  describe("CustomError Class", () => {
    it("should be an instance of Error", () => {
      const error = new CustomError("Test message");
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CustomError);
    });

    it("should set the message correctly", () => {
      const message = "Something went wrong";
      const error = new CustomError(message);
      expect(error.message).toBe(message);
    });

    it("should set the code correctly", () => {
      const code = "ERR_TEST";
      const error = new CustomError("Message", code);
      expect(error.code).toBe(code);
    });

    it("should set the statusCode correctly", () => {
      const statusCode = 404;
      const error = new CustomError("Message", "CODE", statusCode);
      expect(error.statusCode).toBe(statusCode);
    });

    it("should default statusCode to 500 if not provided", () => {
      const error = new CustomError("Message", "CODE");
      expect(error.statusCode).toBe(500);
    });

    it("should set data correctly", () => {
      const data = { details: "some details" };
      const error = new CustomError("Message", "CODE", 400, data);
      expect(error.data).toEqual(data);
    });
  });

  describe("customError Factory Function", () => {
    it("should return an instance of CustomError", () => {
      const error = customError({ message: "Factory error" });
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe("Factory error");
    });

    it("should pass all parameters to the CustomError constructor", () => {
      const params = {
        message: "Factory error",
        code: "FACTORY_CODE",
        statusCode: 403,
        data: { extra: "info" },
      };
      const error = customError(params);

      expect(error.message).toBe(params.message);
      expect(error.code).toBe(params.code);
      expect(error.statusCode).toBe(params.statusCode);
      expect(error.data).toEqual(params.data);
    });

    it("should use default statusCode when not provided via factory", () => {
      const error = customError({ message: "Factory error" });
      expect(error.statusCode).toBe(500);
    });
  });
});
