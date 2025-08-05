# Clean Architecture with TypeScript - Full Cycle 3.0

This repository contains the source code for the practical module of the Full Cycle 3.0 Clean Architecture course. It is a sample project built with TypeScript that demonstrates the application of Clean Architecture principles and various design patterns in a real-world scenario.

## Core Concepts of Clean Architecture

This project is structured following the Clean Architecture principles, ensuring a separation of concerns and making the system easier to maintain, test, and scale.

### The Layers

- **Domain (Entities)**: Located in `src/domain`, this is the core of the application. It contains the business logic and rules, encapsulated in entities and value objects. This layer is completely independent of any external framework or library.
- **Application (Use Cases)**: The `src/application` layer orchestrates the data flow between the domain and the outer layers. It contains the application-specific business rules and use cases (e.g., `CreateCustomerUseCase`).
- **Infrastructure (Interfaces/Adapters)**: The `src/infra` layer is responsible for implementing the interfaces defined in the domain layer. This includes repositories for data persistence, communication with external APIs, and web server setup (e.g., Express).

## Design Patterns Employed

Several design patterns were used throughout the project to solve common problems and improve the code's structure and reusability.

- **Repository Pattern**: Used to abstract the data persistence logic. The repository interfaces are defined in the domain layer (`src/domain/@shared/repository` and `src/domain/*/repository`), and their implementations are in the infrastructure layer (`src/infra/*/repository`). This decouples the business logic from the data source.
- **Factory Pattern**: Factories are used to create complex objects, abstracting the instantiation logic. Examples include `CustomerFactory` (`src/domain/customer/factory/customer.factory.ts`) and `ProductFactory` (`src/domain/product/factory/product.factory.ts`).
- **Observer Pattern (Event Dispatcher)**: The event dispatcher system (`src/domain/@shared/event`) is a practical implementation of the Observer pattern. It allows different parts of the system to react to events (e.g., `ProductCreatedEvent`) without being tightly coupled.
- **Notification Pattern**: The notification system (`src/domain/@shared/notification`) is used to handle validation errors and other notifications in a structured way, allowing the application to respond appropriately to user input errors.
- **Value Object**: Objects that represent a descriptive aspect of the domain with no conceptual identity are treated as Value Objects. `Address` (`src/domain/customer/value-object/address.ts`) is an example, representing a customer's address.
- **Dependency Injection**: Dependencies are injected into components (e.g., use cases, repositories) to promote loose coupling and facilitate testing.

## Project Structure

The project's directory structure reflects the Clean Architecture layers:

```
src/
├── application/  # Use Cases
├── domain/       # Entities, Value Objects, Repositories Interfaces, Events
├── infra/        # Repositories Implementation, Web Server, etc.
```

## Technologies Used

- **TypeScript**: The primary language for the project.
- **Node.js**: The runtime environment.
- **Express**: Used as the web server in the infrastructure layer.
- **Sequelize**: As the ORM for database interaction.
- **Jest**: For unit and integration testing.
- **Supertest**: For e2e testing of the HTTP endpoints.
- **Yup**: For validations.

## Getting Started

### With Docker

To run this project using Docker, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nascyimento/clean-architecture.git
   cd clean-architecture
   ```

2. **Build the Docker image:**
   ```bash
   npm run docker:build
   ```

3. **Run the tests:**
   ```bash
   npm run docker:test
   ```
   This command will start a container, run the tests, and then stop.

### Without Docker

To run this project locally without Docker, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nascyimento/clean-architecture.git
   cd clean-architecture
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the tests:**
   ```bash
   npm test
   ```
