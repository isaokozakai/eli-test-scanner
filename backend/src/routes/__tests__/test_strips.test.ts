import request from "supertest";
import path from "path";
import app from "../..";
import * as database from "../../database";

jest.mock("../../database");

const mockedSave = database.saveTestStrip as jest.Mock;
const mockedGet = database.getTestStrips as jest.Mock;

describe("POST /api/test-strips/upload", () => {
  it("uploads an image and returns metadata", async () => {
    mockedSave.mockResolvedValue({
      id: "mock-id",
      thumbnail_path: "uploads/thumb.png",
    });

    const res = await request(app)
      .post("/api/test-strips/upload")
      .attach("image", path.resolve(__dirname, "test-strip-valid-1.png"));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: "mock-id",
      thumbnail_path: "uploads/thumb.png",
    });
  });
});

describe("GET /api/test-strips", () => {
  it("returns a list of uploaded test strips", async () => {
    mockedGet.mockResolvedValue([
      { id: "mock-id-1", thumbnail_path: "thumb1.png" },
      { id: "mock-id-2", thumbnail_path: "thumb2.png" },
    ]);

    const res = await request(app).get("/api/test-strips");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });
});
