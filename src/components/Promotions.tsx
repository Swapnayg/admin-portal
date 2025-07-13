'use client';

import { useEffect, useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowUpDown, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ErrorDialog } from '@/components/ErrorDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ✅ Corrected Union Type
type PromotionType =
  | 'COUPON'
  | 'CATEGORY'
  | 'PRODUCT'
  | 'USER_GROUP'
  | 'VENDOR'
  | 'CART_VALUE'
  | 'FREE_SHIPPING'
  | 'BOGO'
  | 'SEASONAL'
  | 'FLASH_SALE';

type PromotionStatus = 'ACTIVE' | 'EXPIRED';

type Promotion = {
  id: number;
  title: string;
  code: string;
  discount: number;
  validFrom: string;
  validTo: string;
  type: PromotionType;
  status: PromotionStatus;
};

const promotionTypes: PromotionType[] = [
  'COUPON',
  'CATEGORY',
  'PRODUCT',
  'USER_GROUP',
  'VENDOR',
  'CART_VALUE',
  'FREE_SHIPPING',
  'BOGO',
  'SEASONAL',
  'FLASH_SALE',
];

const PromotionsPage = () => {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [sortBy, setSortBy] = useState<keyof Promotion>('title');
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    fetch('/api/promotions/get-promotions')
      .then((res) => res.json())
      .then((data: Promotion[]) => setPromotions(data))
      .catch(() => {
        setErrorMessage('Failed to load promotions');
        setErrorDialogOpen(true);
      });
  }, []);

  const filteredPromotions = useMemo(() => {
    const cleanedSearch = search.toLowerCase().replace('%', '').trim();

    return promotions
      .filter((promo) => {
        const discountNumber = Number(cleanedSearch);
        const discountMatches = !isNaN(discountNumber) && promo.discount === discountNumber;

        const matchesType = selectedType === "ALL" || promo.type === selectedType;

        return (
          matchesType &&
          (
            promo.title.toLowerCase().includes(cleanedSearch) ||
            promo.code.toLowerCase().includes(cleanedSearch) ||
            promo.type.toLowerCase().includes(cleanedSearch) ||
            promo.status.toLowerCase().includes(cleanedSearch) ||
            discountMatches ||
            format(parseISO(promo.validFrom), 'dd MMM yyyy').toLowerCase().includes(cleanedSearch) ||
            format(parseISO(promo.validTo), 'dd MMM yyyy').toLowerCase().includes(cleanedSearch)
          )
        );
      })

      .sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (sortBy === 'validTo' || sortBy === 'validFrom') {
          return sortAsc
            ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime()
            : new Date(bVal as string).getTime() - new Date(aVal as string).getTime();
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortAsc ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
  }, [search, sortBy, sortAsc, promotions, selectedType]);

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const paginated = filteredPromotions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSort = (key: keyof Promotion) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Promotions</h1>
        <Link href="/promotions/add">
          <Button className="bg-slate-700 hover:bg-slate-800 text-white cursor-pointer">+ Add Promotion</Button>
        </Link>
      </div>

      <Card className="p-4 bg-white border border-gray-200 w-full shadow-sm">
       <div className="flex justify-end items-center mb-4 gap-4">
          <div className="w-64">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-white text-black placeholder:text-slate-500 border border-gray-300"
            />
          </div>
          <div className="w-56">
            <Select onValueChange={setSelectedType} value={selectedType}>
              <SelectTrigger className="w-full h-10 bg-white border border-gray-300 text-black z-50">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="ALL" className="bg-white text-black hover:bg-slate-100">
                  All Types
                </SelectItem>
                {promotionTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="bg-white text-black hover:bg-slate-100"
                  >
                    {type.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table className="w-full border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-100 border-b border-gray-200">
              <TableHead onClick={() => handleSort('title')} className="cursor-pointer">Name <ArrowUpDown className="inline w-4 h-4" /></TableHead>
              <TableHead onClick={() => handleSort('type')} className="cursor-pointer">Type <ArrowUpDown className="inline w-4 h-4" /></TableHead>
              <TableHead onClick={() => handleSort('code')} className="cursor-pointer">Code <ArrowUpDown className="inline w-4 h-4" /></TableHead>
              <TableHead onClick={() => handleSort('discount')} className="cursor-pointer">Discount % <ArrowUpDown className="inline w-4 h-4" /></TableHead>
              <TableHead onClick={() => handleSort('validTo')} className="cursor-pointer">Validity <ArrowUpDown className="inline w-4 h-4" /></TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">Status <ArrowUpDown className="inline w-4 h-4" /></TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.map((promo) => {
              const isExpired = promo.status === 'EXPIRED';
              return (
                <TableRow key={promo.id} className="border-b border-gray-200">
                  <TableCell>{promo.title}</TableCell>
                  <TableCell>{promo.type.replaceAll('_', ' ')}</TableCell>
                  <TableCell>{promo.code}</TableCell>
                  <TableCell>{promo.discount}%</TableCell>
                  <TableCell>Till {format(parseISO(promo.validTo), 'dd MMM')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-sm rounded-full ${isExpired ? 'bg-gray-200 text-gray-600' : 'bg-green-600 text-white'}`}>
                      {promo.status.charAt(0) + promo.status.slice(1).toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-700 cursor-pointer"
                    onClick={() => router.push(`/promotions/${promo.id}/view`)}>
                      <Eye className="w-4 h-4" /></Button>
                    {!isExpired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-700 cursor-pointer"
                        onClick={() => router.push(`/promotions/${promo.id}/edit`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex justify-between mt-4 items-center text-slate-600">
          <div>Page {page} of {totalPages}</div>
          <div className="space-x-2">
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="bg-slate-700 text-white hover:bg-slate-800"
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-slate-700 text-white hover:bg-slate-800"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="Failed to Load"
        description={errorMessage}
      />
    </div>
  );
};

export default PromotionsPage;
