const request = require("supertest");
const app = require("../app");

describe("GET /product/all", () => {
    it("responds with JSON containing a list of products", async () => {
        const response = await request(app).get("/product/all");

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Success");
        expect(response.body.metadata).toBeDefined();
        expect(Array.isArray(response.body.metadata)).toBe(true);
        // expect(response.body.metadata.length).toBe(...);

        const sampleProduct = response.body.metadata[0];
        expect(sampleProduct).toHaveProperty("_id");
        expect(sampleProduct).toHaveProperty("product_name");
        expect(sampleProduct).toHaveProperty("product_thumb");
        expect(sampleProduct).toHaveProperty("product_sold");
    });
});

