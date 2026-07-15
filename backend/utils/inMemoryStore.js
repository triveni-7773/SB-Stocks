const users = [];
const portfolio = [];
const transactions = [];

const createDemoUser = () => {
  const existing = getUserByEmail('demo@sbstocks.com');
  if (existing) {
    return existing;
  }

  const user = {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@sbstocks.com',
    password: 'demo123',
    balance: 10000
  };
  users.push(user);
  return user;
};

const getUserByEmail = (email) => users.find((user) => user.email === email);

const getUserById = (id) => users.find((user) => user.id === id) || null;

const createUser = ({ name, email, password }) => {
  const existing = getUserByEmail(email);
  if (existing) {
    return null;
  }

  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    password,
    balance: 10000
  };
  users.push(user);
  return user;
};

const loginUser = (email, password) => {
  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    return null;
  }
  return user;
};

const getBalance = (userId) => {
  const user = getUserById(userId) || createDemoUser();
  return user ? user.balance : 10000;
};

const getPortfolioForUser = (userId) => {
  const currentUser = getUserById(userId) || createDemoUser();
  return portfolio
    .filter((item) => item.userId === currentUser.id)
    .map((item) => ({ ...item }));
};

const buyStock = (userId, symbol, quantity, price) => {
  const user = getUserById(userId) || createDemoUser();
  if (!user) {
    return { error: 'User not found' };
  }
  const total = price * quantity;

  if (user.balance < total) {
    return { error: 'Insufficient balance' };
  }

  const existing = portfolio.find((item) => item.userId === user.id && item.symbol === symbol);
  if (existing) {
    const oldCost = existing.buyPrice * existing.quantity;
    existing.quantity += quantity;
    existing.buyPrice = (oldCost + total) / existing.quantity;
  } else {
    portfolio.push({ userId: user.id, symbol, quantity, buyPrice: price });
  }

  user.balance -= total;
  transactions.push({ userId: user.id, type: 'buy', symbol, quantity, price, total });
  return { user, portfolio: getPortfolioForUser(user.id) };
};

const sellStock = (userId, symbol, quantity, price) => {
  const user = getUserById(userId) || createDemoUser();
  if (!user) {
    return { error: 'User not found' };
  }
  const existing = portfolio.find((item) => item.userId === user.id && item.symbol === symbol);

  if (!existing || existing.quantity < quantity) {
    return { error: 'Insufficient holdings' };
  }

  existing.quantity -= quantity;
  if (existing.quantity === 0) {
    const index = portfolio.findIndex((item) => item.userId === user.id && item.symbol === symbol);
    if (index !== -1) {
      portfolio.splice(index, 1);
    }
  }

  user.balance += price * quantity;
  transactions.push({ userId: user.id, type: 'sell', symbol, quantity, price, total: price * quantity });
  return { user, portfolio: getPortfolioForUser(user.id) };
};

module.exports = {
  createDemoUser,
  createUser,
  loginUser,
  getUserByEmail,
  getUserById,
  getBalance,
  getPortfolioForUser,
  buyStock,
  sellStock
};
