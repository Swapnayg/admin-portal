'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Plus, Eye, Pencil } from 'lucide-react';

export default function CmsPageDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage] = useState(3);
  const [filteredPages, setFilteredPages] = useState<any[]>([]);
  const [allPages, setAllPages] = useState<any[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      const res = await fetch(`/api/cms/get-cms`);
      const result = await res.json();
      if (res.ok) {
        setAllPages(result.pages || []);
      }
    };
    fetchPages();
  }, []);

  useEffect(() => {
    const filtered = allPages.filter((page) => {
      const modifiedStr = formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true });
      return (
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase()) ||
        page.status.toLowerCase().includes(search.toLowerCase()) ||
        modifiedStr.toLowerCase().includes(search.toLowerCase())
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    setPage(1);
    setFilteredPages(sorted);
  }, [allPages, search, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredPages.length / perPage);
  const paginatedPages = filteredPages.slice((page - 1) * perPage, page * perPage);

  const handleSort = (field: string) => {
    if (field === sortBy) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (field !== sortBy) return null;
    return sortOrder === 'asc' ? <ChevronUp className="inline w-3 h-3 ml-1" /> : <ChevronDown className="inline w-3 h-3 ml-1" />;
  };

  return (
    <div className="p-4 w-full">
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">CMS Pages</h1>
          <Button className="bg-slate-700 hover:bg-slate-800 text-white cursor-pointer" onClick={() => router.push('/cms/create/edit')}>
            <Plus className="w-4 h-4 mr-2" /> Create Page
          </Button>
        </div>

        <div className="flex justify-end">
          <Input
            placeholder="Search title, slug, status or modified..."
            className="w-64 border border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="border border-gray-200 rounded-xl shadow bg-white pr-6">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-200">
                <TableHead onClick={() => handleSort('title')} className="w-1/5 cursor-pointer">
                  Title {renderSortIcon('title')}
                </TableHead>
                <TableHead onClick={() => handleSort('slug')} className="w-1/5 cursor-pointer">
                  Slug {renderSortIcon('slug')}
                </TableHead>
                <TableHead onClick={() => handleSort('status')} className="w-1/5 cursor-pointer">
                  Status {renderSortIcon('status')}
                </TableHead>
                <TableHead onClick={() => handleSort('updatedAt')} className="w-1/5 cursor-pointer">
                  Last Modified {renderSortIcon('updatedAt')}
                </TableHead>
                <TableHead className="w-1/5 text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPages.length === 0 ? (
                <TableRow className="border-b border-gray-200">
                  <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                    No pages found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPages.map((page: any) => (
                  <TableRow key={page.id} className="border-b border-gray-200 hover:bg-slate-50">
                    <TableCell className="w-1/5 truncate">{page.title}</TableCell>
                    <TableCell className="w-1/5 truncate">{page.slug}</TableCell>
                    <TableCell className="w-1/5">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          page.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {page.status}
                      </span>
                    </TableCell>
                    <TableCell className="w-1/5 truncate">{formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}</TableCell>
                    <TableCell className="w-1/5 text-right pr-4 space-x-2">
                      <Button size="icon" variant="ghost" className="cursor-pointer" onClick={() => router.push(`/cms/${page.id}/edit`)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="cursor-pointer" onClick={() => router.push(`/cms/${page.id}/view`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" size="sm" className="cursor-pointer" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Prev
          </Button>
          <span className="text-slate-600 text-sm px-2 pt-1">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" className="cursor-pointer" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
