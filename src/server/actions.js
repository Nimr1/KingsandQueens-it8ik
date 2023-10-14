import HttpError from '@wasp/core/HttpError.js'

export const farmResources = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  if (user.energy < 40) { throw new HttpError(403, 'Not enough energy') };

  const energyBoost = Math.floor(user.energy * Math.random() * 0.6 + 0.3);

  await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      energy: user.energy - energyBoost,
      resources: user.resources + energyBoost
    }
  });

  return { success: true };
}

export const workForCompany = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { companyId } = args;
  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const company = await context.entities.Company.findUnique({
    where: { id: companyId }
  });

  if (!company) { throw new HttpError(404) };

  const energyCost = Math.floor(Math.random() * 31) + 30;
  const efficiency = Math.floor(Math.random() * 71) + 30;
  const salary = company.salary * (efficiency / 100);

  if (user.energy < energyCost) { throw new HttpError(400, "Not enough energy") };

  await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      energy: user.energy - energyCost,
      money: user.money + salary
    }
  });

  return { success: true };
}

export const buyItem = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { itemId } = args;

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const item = await context.entities.Item.findUnique({
    where: { id: itemId }
  });

  const company = await context.entities.Company.findUnique({
    where: { id: item.companyId }
  });

  if (user.money < item.price) { throw new HttpError(403, 'Insufficient funds') };

  const updatedUser = await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      money: user.money - item.price,
      energy: user.energy + item.energyBoost
    }
  });

  return updatedUser;
}

export const sellResources = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const company = await context.entities.Company.findUnique({
    where: { id: args.companyId }
  });

  if (!company) { throw new HttpError(400, 'Invalid company id') };

  const resourcesSold = Math.min(user.resources, args.amount);
  const moneyEarned = resourcesSold * company.itemPrice;

  await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      resources: user.resources - resourcesSold,
      money: user.money + moneyEarned
    }
  });

  return { resourcesSold, moneyEarned };
}

export const fightBattle = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  if (user.energy < 40) { throw new HttpError(403) };

  const randomReward = Math.random() >= 0.5 ? 'resource' : 'money';

  if (randomReward === 'resource') {
    const resources = user.resources + 1;
    return context.entities.User.update({
      where: { id: context.user.id },
      data: { resources }
    });
  } else {
    const money = user.money + 1;
    return context.entities.User.update({
      where: { id: context.user.id },
      data: { money }
    });
  }
}