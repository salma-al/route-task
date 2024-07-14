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
import Link from 'next/link';

export default function CustomersList({ dataCus, dataTrans }) {
  const [sorting, setSorting] = useState([{ id: 'id', desc: false }]);
  const [colFilter, setColFilter] = useState([]);

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
      <TableContainer>
        <Table variant="simple">
          <Thead>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <Tr key={i}>
                {headerGroup.headers.map((header, i) => (
                  <Th
                    key={i}
                    onClick={header.column.getToggleSortingHandler()}
                    _hover={{ cursor: 'pointer' }}
                    colSpan={header.colSpan}
                  >
                    <Flex alignItems="center" gap={3}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {
                        {
                          asc: <ArrowDownIcon w={15} h={15} />,
                          desc: <ArrowUpIcon w={15} h={15} />,
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
              console.log(row);
              return (
                <Tr key={i}>
                  <Link href={`/transactions/${row.original.id}`}>
                    {row.getVisibleCells().map((cell, i) => (
                      <Td key={i}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Link>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
