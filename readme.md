# Instagram Model JS Documentation

## How to install

```bash
npm i @unq-ui/mercadolibre-model-js
```

## How to use

```typescript
import initSystem from '@unq-ui/mercadolibre-model-js/dist/InitSystem.js';

const mercadolibreService = initSystem();
```

## MercadoLibreSystem

```typescript

class MercadoLibreService {
  products: Product[];
  users: User[];
  categories: Category[];
  carts: Cart[];

  /**
    * Registers a new user.
    * @param draftNewUser The draft user data.
    * @return The registered user.
    * @throws UserException if the email is already registered.
    */
  registerNewUser(draftNewUser: DraftNewUser): User

  /**
   * Retrieves a user by email and password.
   * @param email The user's email.
   * @param password The user's password.
   * @return The user.
   * @throws UserException if the user is not found.
   */
  login(email: string, password: string): User

  /**
   * Retrieves a user by id.
   * @param id The user's id.
   * @return The user.
   * @throws UserException if the user is not found.
   */
  getUser(id: string): User
  
  /**
   * Toggles the like status of a product for a user.
   * @param idUser The user's ID.
   * @param idProduct The product's ID.
   * @return The updated user.
   * @throws UserException if the user is not found.
   * @throws ProductException if the product is not found.
   */
  toggleLike(idUser: string, idProduct: string): User

  /**
   * Adds a new category.
   * @param name The category name.
   * @return The added category.
   * @throws CategoryException if the category already exists.
   */
  addCategory(name: string): Category

  /**
   * Retrieves all categories.
   * @return The list of categories.
   */
  getAllCategories(): Category[]

  /**
   * Retrieves a category by ID.
   * @param id The category's ID.
   * @return The category.
   * @throws CategoryException if the category is not found.
   */
  getCategory(id: string): Category

  /**
   * Adds a new product.
   * @param userId The user's ID.
   * @param draftProduct The draft product data.
   * @return The added product.
   * @throws UserException if the user is not found.
   */
  addProduct(userId: string, draftProduct: DraftProduct): Product

  /**
   * Edits an existing product.
   * @param userId The user's ID.
   * @param productId The product's ID.
   * @param draftProduct The draft product data.
   * @return The edited product.
   * @throws UserException if the user is not found.
   * @throws ProductException if the product is not found.
   * @throws ProductException if the user is not the owner of the product.
   */
  editProduct(userId: string, productId: string, draftProduct: DraftProduct): Product

  /**
   * Retrieves a product by ID.
   * @param id The product's ID.
   * @return The product.
   * @throws ProductException if the product is not found.
   */
  getProduct(id: string): Product

  /**
   * Retrieves all products with pagination.
   * @param pageNumber The page number.
   * @return A page of products.
   */
  getAllProducts(pageNumber: number): Page<Product>

  /**
   * Retrieves related products to a product.
   * @param idProduct The product's ID.
   * @return The list of related products (max 10 products).
   * @throws ProductException if the product is not found.
  */
  getRelatedProducts(idProduct: string): Product[]

  /**
   * Retrieves products by user ID with pagination.
   * @param idUser The user's ID.
   * @param pageNumber The page number.
   * @return A Page of products.
   */
  getProductsByUser(idUser: string, pageNumber: number): Page<Product>

  /**
   * Retrieves products by category ID with pagination.
   * @param idCategory The category's ID.
   * @param pageNumber The page number.
   * @return A page of products.
   */
  getProductsByCategory(idCategory: string, pageNumber: number): Page<Product>

  /**
   * Searches for products by text with pagination.
   * @param text The search text.
   * @param pageNumber The page number.
   * @return A page of products.
   */
  searchProducts(text: string, pageNumber: number): Page<Product>

  /**
   * Updates the quantity of a product in the user's cart.
   * @param userId The user's ID.
   * @param productId The product's ID.
   * @param amount The quantity to update.
   * @return The updated cart.
   * @throws UserException if the user is not found.
   * @throws ProductException if the product is not found.
   */
  updateItemCart(userId: string, productId: string, amount: number): Cart

  /**
   * Deletes a product from the user's cart.
   * @param userId The user's ID.
   * @param productId The product's ID.
   * @return The updated cart.
   * @throws UserException if the user is not found.
   * @throws ProductException if the product is not found.
   */
  deleteItemFromCart(userId: string, productId: string): Cart

  /**
   * Retrieves the cart for a user.
   * @param id The user's ID.
   * @return The cart.
   * @throws UserException if the user is not found.
   */
  getCart(id: string): Cart

  /**
   * Completes a purchase for a user.
   * @param idUser The user's ID.
   * @param payment The payment information.
   * @throws PurchaseException if the cart is empty or items are out of stock.
   * @throws UserException if the user is not found.
   */
  purchase(idUser: string, payment: Payment)

  /**
   * Adds a question to a product.
   * @param idUser The user's ID.
   * @param idProduct The product's ID.
   * @param question The question text.
   * @return The updated product.
   * @throws QuestionException if the user is the owner of the product.
   * @throws UserException if the user is not found.
   * @throws ProductException if the product is not found.
   */
  addQuestion(idUser: string, idProduct: string, question: string): Product

  /**
   * Adds an answer to a question on a product.
   * @param idUser The user's ID.
   * @param idProduct The product's ID.
   * @param idQuestion The question's ID.
   * @param text The answer text.
   * @return The updated product.
   * @throws QuestionException if the user is not the owner of the product or the question is not found.
   * @throws UserException if the user is not found.
   * @throws ProductException if the product is not found.
   */
  addAnswer(idUser: string, idProduct: string, idQuestion: string, text: string): Product

}
```

## Model


```typescript
type Category = {
  id: string;
  name: string;
};
```

```typescript
type Characteristic = {
  name: string;
  value: string;
};
```

```typescript
type Shipping = {
  price: number;
};
```

```typescript
type Product = {
  id: string;
  owner: User;
  title: string;
  description: string;
  images: string[];
  stock: number;
  price: number;
  shipping: Shipping;
  characteristics: Characteristic[];
  category: Category;
  questions: Question[];
};
```

```typescript
type SaleHistory = {
  product: Product;
  amount: number;
  payment: Payment;
  date: Date;
  user: User;
};
```

```typescript
type PurchaseHistory = {
  items: Item[];
  payment: Payment;
  date: Date;
};
```

```typescript
type Question = {
  id: string;
  product: Product;
  user: User;
  text: string;
  response?: string;
};
```

```typescript
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  purchaseHistory: PurchaseHistory[];
  products: Product[];
  likedProducts: Product[];
  salesHistory: SaleHistory[];
};
```

```typescript
type Item = {
  product: Product;
  amount: number;
};
```

```typescript
type Cart = {
  user: User;
  items: Item[];
};
```

```typescript
type Payment = {
  cardNumber: string;
  expirationDate: Date;
  cvv: string;
  name: string;
};
```

## Drafts

```typescript
type DraftNewUser = {
  name: string;
  email: string;
  password: string;
  image: string;
};
```

```typescript
type DraftProduct = {
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  shipping: Shipping;
  characteristics: Characteristic[];
  category: Category;
}
```

## Utilidades

```typescript
type Page<T> = {
  amountOfPages: number,
  currentPage: number,
  items: T[],
  amountOfElements: number
};
```

```typescript
const getPage = <T>(list: T[], page: number): Page<T>
```
