import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import {
  Td,
  Th,
  Tr,
  Text,
  Tbody,
  Thead,
  Table,
  ListItem,
  UnorderedList,
  TableContainer,
  Heading,
  Flex,
  Input,
  Box,
} from '@chakra-ui/react';
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomersList({ dataCus, dataTrans }) {
  const [sorting, setSorting] = useState([{ id: 'id', desc: false }]);
  const [colFilter, setColFilter] = useState([]);

  const router = useRouter();

  const handleRowClick = (id) => {
    router.push(`/transactions/${id}`);
  };

  const dataTotal = React.useMemo(() => {
    return dataCus.map((customer) => {
      const transactions = dataTrans.filter((transaction) => {
        return transaction.customer_id === +customer.id;
      });

      const totalAmount = transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      return {
        ...customer,
        transactions,
        totalAmount,
      };
    });
  }, [dataCus, dataTrans]);

  // console.log(dataTotal);

  const columns = [
    {
      accessorKey: 'id',
      header: () => <Heading size="sm">ID</Heading>,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'name',
      header: () => <Heading size="sm">Name</Heading>,
      // enableColumnFilter: true,
    },
    {
      accessorKey: 'transactions',
      header: () => <Heading size="sm">Transactions</Heading>,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const transactions = row.original.transactions;

        return (
          <UnorderedList>
            {transactions.map((transaction, i) => (
              <ListItem key={i}>
                <Text
                  key={i}
                >{`Date: ${transaction.date}, Amount: ${transaction.amount}`}</Text>
              </ListItem>
            ))}
          </UnorderedList>
        );
      },
    },
    {
      accessorKey: 'totalAmount',
      header: () => <Heading size="sm">Total Amount</Heading>,
      // enableColumnFilter: true,
      filterFn: 'number',
      cell: ({ row }) => {
        return (
          <Text fontWeight="500" mt={3}>
            {row.original.totalAmount}
          </Text>
        );
      },
    },
  ];

  // const data = React.useMemo(() => dataTotal, [dataTotal]);

  const filterFns = React.useMemo(
    () => ({
      number: (row, columnId, filterValue) => {
        const rowValue = row.getValue(columnId);
        if (!filterValue) return true;
        const rowStr = rowValue.toString();
        return rowStr.includes(filterValue);
      },
    }),
    []
  );

  const table = useReactTable({
    data: dataTotal,
    columns,
    filterFns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      columnFilters: colFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColFilter,
  });

  return (
    <>
      <TableContainer
        border="1px solid #d5cbcb"
        borderRadius="8px"
        margin="auto"
        width="80%"
        my={10}
      >
        <Table variant="striped">
          <Thead>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <Tr key={i}>
                {headerGroup.headers.map((header, i) => (
                  <Th
                    key={i}
                    onClick={header.column.getToggleSortingHandler()}
                    _hover={{ cursor: 'pointer' }}
                    colSpan={header.colSpan}
                    verticalAlign="top"
                  >
                    <Flex alignItems="center" gap={3}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {
                        {
                          asc: <ArrowDownIcon w={"20px"} h={"20px"} />,
                          desc: <ArrowUpIcon w={"20px"} h={"20px"} />,
                        }[header.column.getIsSorted() ?? null]
                      }
                    </Flex>
                    {header.column.getCanFilter() ? (
                      <Box>
                        <Input
                          type="text"
                          value={header.column.getFilterValue() || ''}
                          // value={header.column.getFilterValue() ?? ''}
                          onChange={(e) => {
                            header.column.setFilterValue(e.target.value);
                          }}
                          placeholder="Search..."
                          size="sm"
                          w="75%"
                        />
                      </Box>
                    ) : null}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {table.getRowModel().rows.map((row, i) => {
              return (
                <Tr
                  onClick={() => handleRowClick(row.original.id)}
                  key={i}
                  _hover={{ cursor: 'pointer' }}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <Td key={i} verticalAlign="top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
