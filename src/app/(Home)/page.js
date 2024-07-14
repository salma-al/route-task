'use client';

import { useQuery } from '@tanstack/react-query';

import { getCustomers, getTransactions } from '@/utils/http';
import { Heading, Text } from '@chakra-ui/react';
import CustomersList from '@/components/CustomersList';

export default function Home() {
  const {
    data: dataCus,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const {
    data: transactions,
    isLoading: isLoadingTrans,
    error: errorTrans,
    isError: isErrorTrans,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  if (isLoading || isLoadingTrans) return <Text>Loading...</Text>;

  if (isError || isErrorTrans)
    return <Text>Error: {isError ? error : errorTrans}</Text>;

  return (
    <>
      <Heading as="h1" my={10} textAlign="center">Customers data </Heading>
      <CustomersList dataCus={dataCus} dataTrans={transactions} />
    </>
  );
}
