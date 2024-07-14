'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ArrowBackIcon } from '@chakra-ui/icons';

import Chart from '@/components/Chart';
import { getCustomers, getTransactions } from '@/utils/http';

export default function Transaction() {
  const { id } = useParams();

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
    data: dataTrans,
    isLoading: isLoadingTrans,
    error: errorTrans,
    isError: isErrorTrans,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const customer =
    dataCus &&
    dataCus.find((cus) => {
      return cus.id === +id;
    });

  const transactions =
    dataTrans &&
    dataTrans.filter((trans) => {
      return trans.customer_id === +id;
    });

  if (isLoading || isLoadingTrans) return <Text>Loading...</Text>;

  if (isError || isErrorTrans)
    return (
      <>
        <Text>Error: {isError ? error : errorTrans}</Text>
        <Text>Please reload the page, or try again later.</Text>
      </>
    );

  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      <Flex alignItems="center" width="80%">
        <Box flexGrow="0.5">
          <Link href="/">
            <ArrowBackIcon w="20px" h="20px" /> Back
          </Link>
        </Box>
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Heading my={8}>{customer?.name}</Heading>
          <Heading size="sm" mb={10}>
            ID: {id}
          </Heading>
        </Flex>
      </Flex>

      <Chart transactions={transactions} />
    </Flex>
  );
}
