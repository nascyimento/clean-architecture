export type NotificationErrorProps = {
    message: string;
    context: string;
};

export default class Notification {
    private errors: NotificationErrorProps[] = [];

    addError(error: NotificationErrorProps): void {
        this.errors.push({ ...error });
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    messages(context?: string): string {
        if (!context) {
            return this.errors.map(error => `${error.context}: ${error.message}`).join(", ");
        }
        
        const filteredErrors = this.errors
            .filter(error => error.context === context)
            .map(error => `${error.context}: ${error.message}`);
            
        return filteredErrors.join(", ");
    }

    getErrors(): NotificationErrorProps[] {
        return this.errors;
    }
}