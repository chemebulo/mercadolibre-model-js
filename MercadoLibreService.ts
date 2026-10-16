import levenshtein from 'fast-levenshtein';

import { DraftNewUser, DraftProduct } from "./draft.js";
import IdGenerator from "./IdGenerator.js";
import { Cart, Category, Payment, Product, User } from "./model.js";
import { getPage, Page } from "./page.js";
import { CategoryException, ProductException, PurchaseException, QuestionException, UserException } from './exception.js';

class MercadoLibreService {
  products: Product[] = [];
  users: User[] = [];
  categories: Category[] = [];
  carts: Cart[] = [];
  IdGenerator = new IdGenerator();

  /**
    * Registers a new user.
    * @param draftNewUser The draft user data.
    * @return The registered user.
    * @throws UserException if the email is already registered.
    */
  registerNewUser(draftNewUser: DraftNewUser): User {
    if (this.users.some(user => user.email === draftNewUser.email)) {
      throw new UserException("The email is already registered.");
    }
    const user: User = {
      id: this.IdGenerator.getNextUserId(),
      name: draftNewUser.name,
      email: draftNewUser.email,
      password: draftNewUser.password,
      image: draftNewUser.image,
      purchaseHistory: [],
      products: [],
      likedProducts: [],
      salesHistory: []
    };
    this.users.push(user);
    return user;
  }

  /**
   * Retrieves a user by email and password.
   * @param email The user's email.
   * @param password The user's password.
   * @return The user.
   * @throws UserException if the user is not found.
   */
  login(email: string, password: string): User {
    const user = this.users.find(user => user.email === email && user.password === password);
    if (!user) {
      throw new UserException("Not found");
    }
    return user;
  }

  /**
   * Retrieves a user by id.
   * @param id The user's id.
   * @return The user.
   * @throws UserException if the user is not found.
   */
  getUser(id: string): User {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new UserException("Not found");
    }
    return user;
  }
  
  /**
   * Toggles the like status of a product for a user.
   * @param idUser The user's ID.
   * @param idProduct The product's ID.
   * @return The updated user.
   * @throws UserException if the user is not found.
   * @throws ProductException if the product is not found.
   */
  toggleLike(idUser: string, idProduct: string): User {
    const user = this.getUser(idUser);
    const product = this.getProduct(idProduct);
    if (user.likedProducts.find(p => p.id === product.id)) {
      user.likedProducts = user.likedProducts.filter(p => p.id !== product.id);
      return user;
    }
    user.likedProducts.push(product);
    return user
  }

  /**
   * Adds a new category.
   * @param name The category name.
   * @return The added category.
   * @throws CategoryException if the category already exists.
   */
  addCategory(name: string): Category {
    if (this.categories.some(category => category.name === name)) {
      throw new CategoryException("The category already exists.");
    }
    const category: Category = {
      id: this.IdGenerator.getNextCategoryId(),
      name,
    };
    this.categories.push(category);
    return category;
  }

  /**
   * Retrieves all categories.
   * @return The list of categories.
   */
  getAllCategories(): Category[] {
    return this.categories;
  }

  /**
   * Retrieves a category by ID.
   * @param id The category's ID.
   * @return The category.
   * @throws CategoryException if the category is not found.
   */
  getCategory(id: string): Category {
    const category = this.categories.find(category => category.id === id);
    if (!category) {
      throw new CategoryException("Not found");
    }
    return category;
  }

  /**
   * Adds a new product.
   * @param userId The user's ID.
   * @param draftProduct The draft product data.
   * @return The added product.
   * @throws UserException if the user is not found.
   */
  addProduct(userId: string, draftProduct: DraftProduct): Product {
    const user = this.getUser(userId);
    const product: Product = {
      id: this.IdGenerator.getNextProductId(),
      owner: user,
      title: draftProduct.title,
      description: draftProduct.description,
      images: draftProduct.images,
      stock: draftProduct.stock,
      price: draftProduct.price,
      shipping: draftProduct.shipping,
      characteristics: draftProduct.characteristics,
      category: draftProduct.category,
      questions: [],
    };
    user.products.push(product);
    this.products.push(product);

    return product
  }

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
  editProduct(userId: string, productId: string, draftProduct: DraftProduct): Product {
    const user = this.getUser(userId);
    const product = this.getProduct(productId);
    if (product.owner.id != user.id) throw new ProductException("Not allowed.");
    product.title = draftProduct.title;
    product.description = draftProduct.description;
    product.images = draftProduct.images
    product.stock = draftProduct.stock
    product.price = draftProduct.price
    product.shipping = draftProduct.shipping
    product.characteristics = draftProduct.characteristics
    product.category = draftProduct.category
    return product
  }

  /**
   * Retrieves a product by ID.
   * @param id The product's ID.
   * @return The product.
   * @throws ProductException if the product is not found.
   */
  getProduct(id: string): Product {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      throw new ProductException("Not found");
    }
    return product;
  }

  /**
   * Retrieves all products with pagination.
   * @param pageNumber The page number.
   * @return A page of products.
   */
  getAllProducts(pageNumber: number): Page<Product> {
    return getPage(this.products, pageNumber);
  }

  /**
   * Retrieves related products to a product.
   * @param idProduct The product's ID.
   * @return The list of related products (max 10 products).
   * @throws ProductException if the product is not found.
  */
  getRelatedProducts(idProduct: string): Product[] {
    const product = this.getProduct(idProduct)
    const relatedProducts = this.products.filter(currentProduct => {
      return levenshtein.get(currentProduct.title, product.title) < 3 && currentProduct.id !== product.id;
    });
    return relatedProducts.slice(0, 10)
  }

  /**
   * Retrieves products by user ID with pagination.
   * @param idUser The user's ID.
   * @param pageNumber The page number.
   * @return A Page of products.
   */
  getProductsByUser(idUser: string, pageNumber: number): Page<Product> {
    const filteredProducts = this.products.filter(product => product.owner.id === idUser);
    return getPage(filteredProducts, pageNumber);
  }

  /**
   * Retrieves products by category ID with pagination.
   * @param idCategory The category's ID.
   * @param pageNumber The page number.
   * @return A page of products.
   */
  getProductsByCategory(idCategory: string, pageNumber: number): Page<Product> {
    const filteredProducts = this.products.filter(product => product.category.id === idCategory);
    return getPage(filteredProducts, pageNumber);
  }

  /**
   * Searches for products by text with pagination.
   * @param text The search text.
   * @param pageNumber The page number.
   * @return A page of products.
   */
  searchProducts(text: string, pageNumber: number): Page<Product> {
    const searchTerms = text.toLowerCase().trim().split(/\s+/);

    const filteredProducts = this.products.filter(product => {
      const titleLower = product.title.toLowerCase();
      const descLower = product.description.toLowerCase();
      const categoryLower = product.category.name.toLowerCase();

      const characteristicsLower = product.characteristics
          .map(char => char.value.toLowerCase())
          .join(' ');

      return searchTerms.every(term =>
          titleLower.includes(term) ||
          descLower.includes(term) ||
          categoryLower.includes(term) ||
          characteristicsLower.includes(term)
      );
    });

    return getPage(filteredProducts, pageNumber);
  }

  /**
   * Updates the quantity of a product in the user's cart.
   * @param userId The user's ID.
   * @param productId The product's ID.
   * @param amount The quantity to update.
   * @return The updated cart.
   * @throws UserException if the user is not found.
   * @throws ProductException if the product is not found.
   */
  updateItemCart(userId: string, productId: string, amount: number): Cart {
    const cart = this.getCart(userId);
    const product = this.getProduct(productId);

    if (cart.items.find(item => item.product.id === productId)) {
      cart.items = cart.items.map(item => {
        if (item.product.id === productId) {
          return { product, amount };
        }
        return item;
      });
    } else {
      cart.items.push({ product, amount });
    }
    return cart
  }

  /**
   * Deletes a product from the user's cart.
   * @param userId The user's ID.
   * @param productId The product's ID.
   * @return The updated cart.
   * @throws UserException if the user is not found.
   * @throws ProductException if the product is not found.
   */
  deleteItemFromCart(userId: string, productId: string): Cart {
    const cart = this.getCart(userId);
    const product = this.getProduct(productId);
    cart.items = cart.items.filter(item => item.product.id !== product.id);
    return cart;
  }

  /**
   * Retrieves the cart for a user.
   * @param id The user's ID.
   * @return The cart.
   * @throws UserException if the user is not found.
   */
  getCart(id: string): Cart {
    const currentCart = this.carts.find(cart => cart.user.id === id);
    if (currentCart) {
      return currentCart;
    }
    const newCart: Cart = { user: this.getUser(id), items: [] };
    this.carts.push(newCart);
    return newCart;
  }

  /**
   * Completes a purchase for a user.
   * @param idUser The user's ID.
   * @param payment The payment information.
   * @throws PurchaseException if the cart is empty or items are out of stock.
   * @throws UserException if the user is not found.
   */
  purchase(idUser: string, payment: Payment) {
    const user = this.getUser(idUser);
    const cart = this.getCart(idUser);
    if (cart.items.length === 0) throw new PurchaseException("Cart is empty");
    if (cart.items.every(it => it.product.stock >= it.amount)) {
      cart.items.forEach(it => {
        it.product.stock -= it.amount;
        it.product.owner.salesHistory.push({
          product: it.product,
          amount: it.amount,
          payment,
          date: new Date(),
          user,
        });
      })
      user.purchaseHistory.push({
        items: cart.items,
        payment,
        date: new Date(),
      })
      this.carts = this.carts.filter(c => c !== cart);
    } else {
      throw new PurchaseException("Unable to complete the purchase because one or more items are out of stock.")
    }
  }

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
  addQuestion(idUser: string, idProduct: string, question: string): Product {
    const user = this.getUser(idUser);
    const product = this.getProduct(idProduct);
    if (product.owner.id == idUser) throw new QuestionException("Not allowed.");
    product.questions.push({
      id: this.IdGenerator.getNextQuestionId(),
      product,
      user,
      text: question,
    });
    return product;
  }

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
  addAnswer(idUser: string, idProduct: string, idQuestion: string, text: string): Product {
    const user = this.getUser(idUser)
    const product = this.getProduct(idProduct)
    if (product.owner.id != user.id) throw new QuestionException("Not allowed.")
    const question = product.questions.find(it => it.id == idQuestion)
    if (!question) throw new QuestionException("Not found")
    question.response = text
    return product
  }
}

export default MercadoLibreService;
