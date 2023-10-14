import HttpError from '@wasp/core/HttpError.js'

export const getUser = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: args.id }
  });

  if (!user) throw new HttpError(404, 'No user with id ' + args.id);

  return user;
}

export const getCompanies = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  return context.entities.Company.findMany();
}

export const getItems = async (args, context) => {
  return context.entities.Item.findMany();
}

export const farmResources = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const energyBoost = 0.6;
  const resourcesGained = Math.floor(user.energy * energyBoost);

  await context.entities.User.update({
    where: { id: context.user.id },
    data: { resources: user.resources + resourcesGained, energy: 0 }
  });

  return resourcesGained;
}

export const workForCompany = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const company = await context.entities.Company.findUnique({
    where: { id: args.companyId }
  });

  const salary = company.salary;
  const energyBoost = 0.3 + Math.random() * 0.7;

  const resourcesGained = Math.floor(user.energy * energyBoost);

  await context.entities.User.update({
    where: { id: context.user.id },
    data: { resources: user.resources + resourcesGained, energy: 0, money: user.money + salary }
  });

  return resourcesGained;
}

export const buyItem = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const item = await context.entities.Item.findUnique({
    where: { id: args.itemId }
  });

  if (user.money < item.price) { throw new HttpError(400, 'Not enough money to buy item') };

  await context.entities.User.update({
    where: { id: context.user.id },
    data: { money: user.money - item.price }
  });

  switch (item.type) {
    case 'bed':
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { bed: true }
      });
      break;
    case 'weapon':
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { weapon: true }
      });
      break;
    case 'food10':
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { energy: user.energy + 10 }
      });
      break;
    case 'food50':
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { energy: user.energy + 50 }
      });
      break;
    case 'food100':
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { energy: user.energy + 100 }
      });
      break;
    default:
      throw new HttpError(400, 'Invalid item type');
  }

  return true;
}

export const sellResources = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  if (user.resources < args.amount) { throw new HttpError(400, 'Not enough resources to sell') };

  await context.entities.User.update({
    where: { id: context.user.id },
    data: { resources: user.resources - args.amount, money: user.money + args.amount }
  });

  return true;
}

export const fightBattle = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  if (!user.weapon) { throw new HttpError(400, 'You need a weapon to fight') };

  if (user.energy < 40) { throw new HttpError(400, 'Not enough energy to fight') };

  const blocks = ['block1', 'block2', 'block3', 'block4', 'block5'];
  const shuffledBlocks = blocks.sort(() => Math.random() - 0.5);

  const startTime = Date.now();

  const clickedBlocks = [];

  const clickBlock = (block) => {
    clickedBlocks.push(block);

    if (clickedBlocks.length === blocks.length) {
      const endTime = Date.now();
      const timeElapsed = endTime - startTime;

      if (timeElapsed > 5000) { throw new HttpError(400, 'Too slow, you lost the battle') };

      const reward = Math.floor(Math.random() * 100);

      await context.entities.User.update({
        where: { id: context.user.id },
        data: { energy: user.energy - 40, money: user.money + reward }
      });

      return reward;
    }
  };

  return { shuffledBlocks, clickBlock };
}