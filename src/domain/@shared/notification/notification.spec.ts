import Notification from "./notification";

describe("Notification unit tests", () => {
    it("should create errors", () => {
        const notification = new Notification();
        const error = {
            message: "Error message",
            context: "Customer"
        }

        notification.addError(error);
        error.message = "Another error message";
        notification.addError(error);
        error.context = "Order";
        notification.addError(error);


        expect(notification.hasErrors()).toBe(true);
        expect(notification.messages("Customer")).toEqual("Customer: Error message, Customer: Another error message");
        expect(notification.messages("Order")).toEqual("Order: Another error message");
        expect(notification.messages("Nonexistent context")).toEqual("");
        expect(notification.messages()).toBe("Customer: Error message, Customer: Another error message, Order: Another error message");
    });

    it("should return all errors", () => {
        const notification = new Notification();
        const error1 = { message: "Error 1", context: "Context1" };
        const error2 = { message: "Error 2", context: "Context2" };
        const error3 = { message: "Error 3", context: "Context1" };
        
        notification.addError(error1);
        notification.addError(error2);
        notification.addError(error3);

        expect(notification.hasErrors()).toBe(true);
        expect(notification.getErrors()).toHaveLength(3);
        expect(notification.getErrors()).toEqual([
            { message: "Error 1", context: "Context1" },
            { message: "Error 2", context: "Context2" },
            { message: "Error 3", context: "Context1" }
        ]);
    })
})