import Rand from 'rand-seed';

import { Payment } from './model.js';
import allComments from './data/comments.js';
import MercadoLibreService from './MercadoLibreService.js';
import allUsers from './data/users.js';
import allProduct from './data/products.js';
import { DraftProduct } from './draft.js';

const rand = new Rand('mercadolibre-model');

const getPayment = (): Payment => ({ cardNumber: "1111-1111-1111-1111", expirationDate: new Date(), cvv: "123", name: "Example", });

const randomNumber = (random: Rand, from: number, to: number) => {
  return Math.floor(random.next() * (to - from) + from);
}

const getNewPrice = (price: number) => randomNumber(rand, price / 2, price * 2);

const getRandomQuestion = () => allComments[randomNumber(rand, 0, allComments.length -1)];

const shuffleArray = <T>(array: T[], amountOfElements: number): T[] => {
  return Array.from({ length: amountOfElements }, () => array[randomNumber(rand, 0, array.length - 1)]);
}

const addAllCategories = (mercadoLibreService: MercadoLibreService) => {
  const categories =[
    "beauty",
    "fragrances",
    "furniture",
    "groceries",
    "home-decoration",
    "kitchen-accessories",
    "laptops",
    "shirts",
    "shoes",
    "watches",
    "mobile-accessories",
    "motorcycle",
    "skin-care",
    "smartphones",
    "sports-accessories",
    "sunglasses",
    "tablets",
    "tops",
    "vehicle",
    "bags",
    "dresses",
    "jewellery",
  ]
  categories.forEach((category) => {
    mercadoLibreService.addCategory(category);
  });
}

const addAllUsers = (mercadoLibreService: MercadoLibreService) => {
  allUsers.map((user) => ({
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    password: user.password,
    image: user.image,
  })).forEach((user) => {
    mercadoLibreService.registerNewUser(user);
  });
}

const addAllProducts = (mercadoLibreService: MercadoLibreService) => {
  const draftProducts: DraftProduct[] = allProduct.map((product) => ({
    title: product.title,
    description: product.description,
    images: product.images,
    stock: product.stock,
    shipping: { price: randomNumber(rand, 0.0, 1000.0) },
    characteristics: product.characteristics,
    category: mercadoLibreService.categories.find((cat) => cat.name === product.category)!!,
    price: getNewPrice(product.price),
  }));

  mercadoLibreService.users.forEach((user) => {
    shuffleArray(draftProducts, 20).forEach((product) => {
      product.price = getNewPrice(product.price);
      product.shipping.price = randomNumber(rand, 0.0, 1000.0);
      mercadoLibreService.addProduct(user.id, product);
    });
  });
}

const addQuestions = (mercadoLibreService: MercadoLibreService) => {
  mercadoLibreService.users.map((user) => {
    shuffleArray(mercadoLibreService.products.filter((product) => product.owner !== user), 30)
      .forEach((product) => {
        mercadoLibreService.addQuestion(user.id, product.id, getRandomQuestion());
      });
  });
}

const addAnswers = (mercadoLibreService: MercadoLibreService) => {
  mercadoLibreService.users.forEach((user) => {
    user.products
      .filter((product) => product.questions.length > 3)
      .forEach((product) => {
        shuffleArray(product.questions, 3).forEach((question) => {
          mercadoLibreService.addAnswer(user.id, product.id, question.id, getRandomQuestion());
        });
      });
  });
}

const addPurchases = (mercadoLibreService: MercadoLibreService) => {
  shuffleArray(mercadoLibreService.users, Math.trunc(mercadoLibreService.users.length * 0.7)).forEach((user) => {
    shuffleArray(mercadoLibreService.products.filter((product) => product.owner !== user), 10)
      .forEach((product) => {
        const amount = randomNumber(rand, 1, 10);
      if (product.stock >= amount) {
        mercadoLibreService.updateItemCart(user.id, product.id, amount)
      }
    })
    if (rand.next() > 0.5) {
      mercadoLibreService.purchase(user.id, getPayment())
    }
  })
};

const addLikes = (mercadoLibreService: MercadoLibreService) => {
  shuffleArray(mercadoLibreService.users, Math.trunc(mercadoLibreService.users.length * 0.7)).forEach((user) => {
    shuffleArray(mercadoLibreService.products.filter((product) => product.owner !== user), 20)
      .forEach((product) => {
        mercadoLibreService.toggleLike(user.id, product.id);
      });
  });
};

const initSystem = () => {
  const mercadoLibreService = new MercadoLibreService();
  addAllCategories(mercadoLibreService);
  addAllUsers(mercadoLibreService);
  addAllProducts(mercadoLibreService);
  addQuestions(mercadoLibreService);
  addAnswers(mercadoLibreService);
  addPurchases(mercadoLibreService);
  addLikes(mercadoLibreService);
  return mercadoLibreService;
}

export default initSystem;