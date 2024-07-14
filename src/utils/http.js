import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

const url = 'https://route-json-server-salma-als-projects.vercel.app/';

export const queryClient = new QueryClient();

export async function getCustomers() {
  const res = await axios.get(`${url}/customers`);

  return res.data;
}

export async function getTransactions() {
  const res = await axios.get(`${url}/transactions`);

  return res.data;
}
