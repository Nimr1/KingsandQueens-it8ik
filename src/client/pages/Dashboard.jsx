import React from 'react';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getUser from '@wasp/queries/getUser';
import getCompanies from '@wasp/queries/getCompanies';
import getItems from '@wasp/queries/getItems';
import farmResources from '@wasp/actions/farmResources';
import workForCompany from '@wasp/actions/workForCompany';
import buyItem from '@wasp/actions/buyItem';
import sellResources from '@wasp/actions/sellResources';
import fightBattle from '@wasp/actions/fightBattle';

export function DashboardPage() {
  const { data: user, isLoading: userLoading, error: userError } = useQuery(getUser, { id: 1 });
  const { data: companies, isLoading: companiesLoading, error: companiesError } = useQuery(getCompanies);
  const { data: items, isLoading: itemsLoading, error: itemsError } = useQuery(getItems);
  const farmResourcesAction = useAction(farmResources);
  const workForCompanyAction = useAction(workForCompany);
  const buyItemAction = useAction(buyItem);
  const sellResourcesAction = useAction(sellResources);
  const fightBattleAction = useAction(fightBattle);

  if (userLoading || companiesLoading || itemsLoading) return 'Loading...';
  if (userError || companiesError || itemsError) return 'Error: ' + (userError || companiesError || itemsError);

  const handleFarmResources = () => {
    farmResourcesAction({});
  };

  const handleWorkForCompany = (companyId) => {
    workForCompanyAction({ companyId });
  };

  const handleBuyItem = (itemId) => {
    buyItemAction({ itemId });
  };

  const handleSellResources = (companyId, amount) => {
    sellResourcesAction({ companyId, amount });
  };

  const handleFightBattle = () => {
    fightBattleAction({});
  };

  return (
    <div className='p-4'>
      <h1>Welcome to KingsandQueens!</h1>
      <h2>Current Status:</h2>
      <p>Country: {user.country}</p>
      <p>Role: {user.role}</p>
      <p>Energy: {user.energy}</p>
      <p>Money: {user.money}</p>
      <p>Resources: {user.resources}</p>
      <h2>Items:</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <h2>Companies:</h2>
      <ul>
        {companies.map((company) => (
          <li key={company.id}>{company.name}</li>
        ))}
      </ul>
      <button onClick={handleFarmResources}>Farm Resources</button>
      <button onClick={() => handleWorkForCompany(1)}>Work for Company 1</button>
      <button onClick={() => handleWorkForCompany(2)}>Work for Company 2</button>
      <button onClick={() => handleWorkForCompany(3)}>Work for Company 3</button>
      <button onClick={() => handleBuyItem(1)}>Buy Item 1</button>
      <button onClick={() => handleBuyItem(2)}>Buy Item 2</button>
      <button onClick={() => handleBuyItem(3)}>Buy Item 3</button>
      <button onClick={() => handleSellResources(1, 10)}>Sell 10 Resources to Company 1</button>
      <button onClick={() => handleSellResources(2, 10)}>Sell 10 Resources to Company 2</button>
      <button onClick={() => handleSellResources(3, 10)}>Sell 10 Resources to Company 3</button>
      <button onClick={handleFightBattle}>Fight Battle</button>
    </div>
  );
}