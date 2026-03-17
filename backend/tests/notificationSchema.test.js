import { CreateNotificationSchema } from "../src/services/notificationService.js";
describe("CreateNotificationSchema", () => {
    it("accepts the example payload", () => {
        const parsed = CreateNotificationSchema.safeParse({
            userId: "123",
            type: "ORDER_PLACED",
            channels: ["email", "push"],
            data: { orderId: "456" },
        });
        expect(parsed.success).toBe(true);
    });
});
