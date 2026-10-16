import { describe, test, expect } from '@jest/globals';

import { DraftNewUser, DraftProduct } from './draft.js';
import MercadoLibreService from './MercadoLibreService.js';
import { Category, Characteristic, Payment, Shipping } from './model.js';
import initSystem from './InitSystem.js';
import { CategoryException, ProductException, PurchaseException, QuestionException, UserException } from './exception.js';

const getDraftNewUser = (name: string): DraftNewUser => {
  return {
    name,
    email: `${name}@example.com`,
    password: `password_${name}`,
    image: `image.com/asd.png`
  };
};

const getDraftProduct = (name: string, categoryId: string = "c_1"): DraftProduct => {
  return {
    title: name,
    description: `description: ${name}`,
    price: 10.0,
    images: [`image.com/${name}.png`],
    stock: 10,
    shipping: { price: 100.0 } as Shipping,
    characteristics: [{ name: "name1", value: "value1" } as Characteristic],
    category: { id: categoryId, name: "cat1" } as Category
  };
};

describe('MercadoLibreServiceTest', () => {

  test('registerNewUserTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    expect(mercadoLibreService.users.length).toBe(0);
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("name"));
    expect(mercadoLibreService.users.length).toBe(1);
    expect(mercadoLibreService.users[0]).toEqual(user);
  });

  test('registerNewUserTwoTimesTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    expect(mercadoLibreService.users.length).toBe(0);
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    expect(mercadoLibreService.users.length).toBe(1);
    expect(mercadoLibreService.users[0]).toEqual(user);

    expect(() => {
      mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    }).toThrow(UserException);
  });

  test('getUserTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const registerUser = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const user = mercadoLibreService.login("example@example.com", "password_example");
    expect(user).toEqual(registerUser);
  });

  test('getUserWithWrongEmailTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    expect(() => {
      mercadoLibreService.login("example1@example.com", "password_example");
    }).toThrow(UserException);
  });

  test('getUserWithWrongPasswordTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    expect(() => {
      mercadoLibreService.login("example@example.com", "password_example1");
    }).toThrow(UserException);
  });

  test('getUserByIdTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const registerUser = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const user = mercadoLibreService.getUser("u_1"); // Nota: Si en JS separaste getUserById, cámbialo aquí
    expect(user).toEqual(registerUser);
  });

  test('getUserByIdWithoutUserTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    expect(() => {
      mercadoLibreService.getUser("u_1");
    }).toThrow(UserException);
  });

  test('toggleLikeTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const registerUser = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const product = mercadoLibreService.addProduct(registerUser.id, getDraftProduct("product"));

    expect(registerUser.likedProducts.length).toBe(0);
    mercadoLibreService.toggleLike(registerUser.id, product.id);
    expect(registerUser.likedProducts.length).toBe(1);
    mercadoLibreService.toggleLike(registerUser.id, product.id);
    expect(registerUser.likedProducts.length).toBe(0);
  });

  test('addCategoryTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    expect(mercadoLibreService.categories.length).toBe(0);
    const category = mercadoLibreService.addCategory("cat1");
    expect(mercadoLibreService.categories.length).toBe(1);
    expect(mercadoLibreService.categories[0]).toEqual(category);
  });

  test('addCategoryTwoTimesTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    expect(mercadoLibreService.categories.length).toBe(0);
    mercadoLibreService.addCategory("cat1");
    expect(mercadoLibreService.categories.length).toBe(1);
    expect(() => {
      mercadoLibreService.addCategory("cat1");
    }).toThrow(CategoryException);
  });

  test('getAllCategoriesTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    expect(mercadoLibreService.getAllCategories().length).toBe(0);
    mercadoLibreService.addCategory("cat1");
    expect(mercadoLibreService.getAllCategories().length).toBe(1);
  });

  test('getCategoryTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const category = mercadoLibreService.addCategory("cat1");
    expect(mercadoLibreService.getCategory("c_1")).toEqual(category);
  });

  test('getCategoryWrongIdTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    expect(() => {
      mercadoLibreService.getCategory("c_1");
    }).toThrow(CategoryException);
  });

  test('addProductTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const registerUser = mercadoLibreService.registerNewUser(getDraftNewUser("example"));

    expect(mercadoLibreService.products.length).toBe(0);
    expect(registerUser.products.length).toBe(0);

    const product = mercadoLibreService.addProduct(registerUser.id, getDraftProduct("product"));

    expect(mercadoLibreService.products.length).toBe(1);
    expect(mercadoLibreService.products[0]).toEqual(product);
    expect(registerUser.products.length).toBe(1);
    expect(registerUser.products[0]).toEqual(product);
  });

  test('editProductTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const registerUser = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const product = mercadoLibreService.addProduct(registerUser.id, getDraftProduct("product"));

    expect(mercadoLibreService.products.length).toBe(1);

    const updatedDraft = getDraftProduct("product2");
    updatedDraft.price = 50.0;

    mercadoLibreService.editProduct(registerUser.id, product.id, updatedDraft);

    expect(mercadoLibreService.products.length).toBe(1);
    expect(product.title).toBe("product2");
    expect(product.price).toBe(50.0);
  });

  test('editProductNotOwnerTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const owner = mercadoLibreService.registerNewUser(getDraftNewUser("owner"));
    const anotherUser = mercadoLibreService.registerNewUser(getDraftNewUser("anotherUser"));
    const product = mercadoLibreService.addProduct(owner.id, getDraftProduct("product"));

    expect(mercadoLibreService.products.length).toBe(1);

    expect(() => {
      mercadoLibreService.editProduct(anotherUser.id, product.id, getDraftProduct("product_anotherUser"));
    }).toThrow(ProductException);

    expect(product.title).toBe("product");
  });

  test('getProductTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const registerUser = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const registerProduct = mercadoLibreService.addProduct(registerUser.id, getDraftProduct("product"));
    const product = mercadoLibreService.getProduct(registerProduct.id);
    expect(product).toEqual(registerProduct);
  });

  test('getProductWithWrongIdTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    expect(() => {
      mercadoLibreService.getProduct("p_1");
    }).toThrow(ProductException);
  });

  test('getProductsByUserTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const user2 = mercadoLibreService.registerNewUser(getDraftNewUser("user1"));
    const user3 = mercadoLibreService.registerNewUser(getDraftNewUser("user2"));

    const productFromUser = mercadoLibreService.addProduct(user.id, getDraftProduct("product"));
    const productFromUser2 = mercadoLibreService.addProduct(user2.id, getDraftProduct("product2"));

    const response = mercadoLibreService.getProductsByUser(user.id, 1);
    expect(response.items[0]).toEqual(productFromUser);

    const response2 = mercadoLibreService.getProductsByUser(user2.id, 1);
    expect(response2.items[0]).toEqual(productFromUser2);

    const response3 = mercadoLibreService.getProductsByUser(user3.id, 1);
    expect(response3.items.length).toBe(0);
  });

  test('getProductsByUserWithWrongPageTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));

    expect(() => { mercadoLibreService.getProductsByUser(user.id, -1); }).toThrow(Error);
    expect(() => { mercadoLibreService.getProductsByUser(user.id, 0); }).toThrow(Error);

    const response = mercadoLibreService.getProductsByUser(user.id, 10);
    expect(response.items.length).toBe(0);
  });

  test('getProductsByCategoryTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const productFromUser = mercadoLibreService.addProduct(user.id, getDraftProduct("product"));
    const product2FromUser = mercadoLibreService.addProduct(user.id, getDraftProduct("product2", "c_2"));

    const response = mercadoLibreService.getProductsByCategory("c_1", 1);
    expect(response.items[0]).toEqual(productFromUser);

    const response2 = mercadoLibreService.getProductsByCategory("c_2", 1);
    expect(response2.items[0]).toEqual(product2FromUser);
  });

  test('searchProductTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));

    mercadoLibreService.addProduct(user.id, getDraftProduct("Zapatilla Deportiva Nike"));
    mercadoLibreService.addProduct(user.id, { ...getDraftProduct("Remera"), description: "Remera nike de algodon" });
    mercadoLibreService.addProduct(user.id, getDraftProduct("Gorra", "c_2"));

    const productCharacteristic = getDraftProduct("Botella");
    productCharacteristic.characteristics = [{ name: "Color", value: "Rojo" }];
    mercadoLibreService.addProduct(user.id, productCharacteristic);

    let result = mercadoLibreService.searchProducts("   ZaPaTiLLa   ", 1);
    expect(result.items.length).toBe(1);
    expect(result.items[0].title).toBe("Zapatilla Deportiva Nike");

    result = mercadoLibreService.searchProducts("nike zapatilla", 1);
    expect(result.items.length).toBe(1);
    expect(result.items[0].title).toBe("Zapatilla Deportiva Nike");

    result = mercadoLibreService.searchProducts("algodon", 1);
    expect(result.items.length).toBe(1);
    expect(result.items[0].title).toBe("Remera");

    result = mercadoLibreService.searchProducts("rojo", 1);
    expect(result.items.length).toBe(1);
    expect(result.items[0].title).toBe("Botella");

    result = mercadoLibreService.searchProducts("   ", 1);
    expect(result.items.length).toBe(4);
  });

  test('updateItemCartTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const p1 = mercadoLibreService.addProduct(user.id, getDraftProduct("product"));
    const p2 = mercadoLibreService.addProduct(user.id, getDraftProduct("product2", "c_2"));

    let cart = mercadoLibreService.updateItemCart(user.id, p1.id, 1);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].product).toEqual(p1);
    expect(cart.items[0].amount).toBe(1);

    cart = mercadoLibreService.updateItemCart(user.id, p1.id, 2);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].product).toEqual(p1);
    expect(cart.items[0].amount).toBe(2);

    cart = mercadoLibreService.updateItemCart(user.id, p2.id, 10);
    expect(cart.items.length).toBe(2);
    expect(cart.items[0].product).toEqual(p1);
    expect(cart.items[0].amount).toBe(2);
    expect(cart.items[1].product).toEqual(p2);
    expect(cart.items[1].amount).toBe(10);
  });

  test('deleteItemFromCartTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const p1 = mercadoLibreService.addProduct(user.id, getDraftProduct("product"));

    let cart = mercadoLibreService.updateItemCart(user.id, p1.id, 1);
    expect(cart.items.length).toBe(1);

    cart = mercadoLibreService.deleteItemFromCart(user.id, p1.id);
    expect(cart.items.length).toBe(0);

    cart = mercadoLibreService.deleteItemFromCart(user.id, p1.id);
    expect(cart.items.length).toBe(0);
  });

  test('getCartTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));

    expect(mercadoLibreService.carts.length).toBe(0);
    const cart = mercadoLibreService.getCart(user.id);
    expect(mercadoLibreService.carts.length).toBe(1);
    expect(mercadoLibreService.carts[0]).toEqual(cart);
  });

  test('purchaseTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const seller = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const buyer = mercadoLibreService.registerNewUser(getDraftNewUser("user"));
    const p1 = mercadoLibreService.addProduct(seller.id, getDraftProduct("product"));
    mercadoLibreService.updateItemCart(buyer.id, p1.id, 1);

    expect(seller.salesHistory.length).toBe(0);
    expect(buyer.purchaseHistory.length).toBe(0);
    expect(p1.stock).toBe(10);

    // Ajustado para crear el objeto Payment usando la sintaxis de JS
    const payment: Payment = { cardNumber: "3333", expirationDate: new Date(), cvv: "333", name: "pepe" };
    mercadoLibreService.purchase(buyer.id, payment);

    expect(seller.salesHistory.length).toBe(1);
    expect(seller.salesHistory[0].amount).toBe(1);
    expect(seller.salesHistory[0].user).toEqual(buyer);
    expect(seller.salesHistory[0].product).toEqual(p1);
    expect(seller.salesHistory[0].payment).toEqual(payment);

    expect(buyer.purchaseHistory.length).toBe(1);
    expect(buyer.purchaseHistory[0].items[0].product).toEqual(p1);
    expect(p1.stock).toBe(9);
  });

  test('purchaseWithoutItemsTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const buyer = mercadoLibreService.registerNewUser(getDraftNewUser("user"));
    expect(() => {
      mercadoLibreService.purchase(buyer.id, { cardNumber: "3333", expirationDate: new Date(), cvv: "333", name: "pepe" } as Payment);
    }).toThrow(PurchaseException);
  });

  test('purchaseMoreItemsThanStockTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const seller = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const buyer = mercadoLibreService.registerNewUser(getDraftNewUser("user"));
    const p1 = mercadoLibreService.addProduct(seller.id, getDraftProduct("product"));
    mercadoLibreService.updateItemCart(buyer.id, p1.id, 100);

    expect(() => {
      mercadoLibreService.purchase(buyer.id, { cardNumber: "3333", expirationDate: new Date(), cvv: "333", name: "pepe" } as Payment);
    }).toThrow(PurchaseException);
  });

  test('addQuestionTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const user2 = mercadoLibreService.registerNewUser(getDraftNewUser("user"));

    const p1 = mercadoLibreService.addProduct(user.id, getDraftProduct("product"));

    expect(p1.questions.length).toBe(0);
    mercadoLibreService.addQuestion(user2.id, p1.id, "question?");

    expect(p1.questions.length).toBe(1);
    expect(p1.questions[0].user).toEqual(user2);
    expect(p1.questions[0].text).toBe("question?");
    expect(p1.questions[0].response).toBeUndefined();
  });

  test('addQuestionSameUserTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const p1 = mercadoLibreService.addProduct(user.id, getDraftProduct("product"));

    expect(() => {
      mercadoLibreService.addQuestion(user.id, p1.id, "question?");
    }).toThrow(QuestionException);
  });

  test('addAnswerTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const user2 = mercadoLibreService.registerNewUser(getDraftNewUser("user"));

    const p1 = mercadoLibreService.addProduct(user.id, getDraftProduct("product"));
    mercadoLibreService.addQuestion(user2.id, p1.id, "question?");
    const question = p1.questions[0];

    expect(question.response).toBeUndefined();

    mercadoLibreService.addAnswer(user.id, p1.id, question.id, "answer");

    expect(question.response).not.toBeNull();
    expect(question.response).toBe("answer");
  });

  test('addAnswerNotOwnerTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const user2 = mercadoLibreService.registerNewUser(getDraftNewUser("user"));

    const p1 = mercadoLibreService.addProduct(user.id, getDraftProduct("product"));
    mercadoLibreService.addQuestion(user2.id, p1.id, "question?");
    const question = p1.questions[0];

    expect(() => {
      mercadoLibreService.addAnswer(user2.id, p1.id, question.id, "answer");
    }).toThrow(QuestionException);
  });

  test('addAnswerQuestionNotFoundTest', () => {
    const mercadoLibreService = new MercadoLibreService();
    const user = mercadoLibreService.registerNewUser(getDraftNewUser("example"));
    const user2 = mercadoLibreService.registerNewUser(getDraftNewUser("user"));

    const p1 = mercadoLibreService.addProduct(user.id, getDraftProduct("product"));

    expect(() => {
      mercadoLibreService.addAnswer(user2.id, p1.id, "q_1", "answer");
    }).toThrow(QuestionException);
  });

  test('getRelatedProductsTest', () => {
    const mercadoLibreService = initSystem();
    expect(mercadoLibreService.getRelatedProducts("p_90").length).toBe(7);
  });

  test('getRelatedProductsTestWithWrongId', () => {
    const mercadoLibreService = initSystem();
    expect(() => {
      mercadoLibreService.getRelatedProducts("p_90000");
    }).toThrow(ProductException);
  });

  test('getAllProductsTest', () => {
    const mercadoLibreService = initSystem();
    const page = mercadoLibreService.getAllProducts(1);
    expect(page.amountOfPages).toBe(87);
    expect(page.currentPage).toBe(1);
    expect(page.amountOfElements).toBe(1300);
  });
});