import { extractQrCodeFromImageBuffer } from "../qr";
import jsQR from "jsqr";

jest.mock("jsqr");

const mockedJsQR = jsQR as jest.Mock;

describe("extractQrCodeFromImageBuffer", () => {
  const dummyBuffer = Buffer.alloc(10); // doesn't matter because we mock

  it("returns expired for ELI-2024-999", () => {
    mockedJsQR.mockReturnValue({ data: "ELI-2024-999" });

    const result = extractQrCodeFromImageBuffer(dummyBuffer, 100, 100);

    expect(result).toEqual({
      qrCode: "ELI-2024-999",
      status: "expired",
      errorMessage: "Test strip expired",
    });
  });

  it("returns valid for ELI-2025-001", () => {
    mockedJsQR.mockReturnValue({ data: "ELI-2025-001" });

    const result = extractQrCodeFromImageBuffer(dummyBuffer, 100, 100);

    expect(result).toEqual({
      qrCode: "ELI-2025-001",
      status: "valid",
      errorMessage: null,
    });
  });

  it("returns invalid for unknown QR format", () => {
    mockedJsQR.mockReturnValue({ data: "SOME-OTHER-CODE" });

    const result = extractQrCodeFromImageBuffer(dummyBuffer, 100, 100);

    expect(result).toEqual({
      qrCode: "SOME-OTHER-CODE",
      status: "invalid",
      errorMessage: "Unknown QR code format",
    });
  });

  it("returns invalid if QR not found", () => {
    mockedJsQR.mockReturnValue(null);

    const result = extractQrCodeFromImageBuffer(dummyBuffer, 100, 100);

    expect(result).toEqual({
      qrCode: null,
      status: "invalid",
      errorMessage: "QR code not found",
    });
  });

  it("handles jsQR throwing an error", () => {
    mockedJsQR.mockImplementation(() => {
      throw new Error("Bad image");
    });

    const result = extractQrCodeFromImageBuffer(dummyBuffer, 100, 100);

    expect(result.status).toBe("invalid");
    expect(result.qrCode).toBeNull();
    expect(result.errorMessage).toContain("Bad image");
  });
});
