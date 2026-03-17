import request from "supertest";
import { createApp } from "../src/app.js";
describe("GET /healthz", () => {
    it("returns ok", async () => {
        const app = createApp();
        const res = await request(app).get("/healthz");
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });
});
