// Product class representing the complex object to be constructed
class Product {
    private parts: string[] = [];

    addPart(part: string): void {
        this.parts.push(part);
    }

    showParts(): void {
        console.log(`Product Parts: ${this.parts.join(', ')}`);
    }
}

// Abstract Builder interface with methods for constructing different parts of the product
interface Builder {
    buildPartA(): void;
    buildPartB(): void;
    getResult(): Product;
}

// Concrete Builder implementation
class ConcreteBuilder implements Builder {
    private product: Product = new Product();

    buildPartA(): void {
        this.product.addPart('PartA');
    }

    buildPartB(): void {
        this.product.addPart('PartB');
    }

    getResult(): Product {
        return this.product;
    }
}

// Director class that orchestrates the construction process using a builder
class Director {
    private builder: Builder;

    constructor(builder: Builder) {
        this.builder = builder;
    }

    construct(): void {
        this.builder.buildPartA();
        this.builder.buildPartB();
    }
}

// Client code
const builder: Builder = new ConcreteBuilder();
const director: Director = new Director(builder);

director.construct();
const product: Product = builder.getResult();
product.showParts();
