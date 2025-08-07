"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { Models } from 'node-appwrite';
import Thumbnail from '@/components/shared/Thumbnail';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getFiles } from '@/lib/actions/files.actions';
import FormattedDateTime from './FormattedDateTime';
import { useDebounce } from 'use-debounce';

const FileSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({ types: [], searchText: debouncedQuery });
      setResults(files?.data?.documents as Models.Document[]);
      setOpen(true);
    };
    fetchResults();
  }, [debouncedQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);
    setQuery("");

    router.push(`/${(file.type === "video" || file.type === "audio") ? "media" : `${file.type}s`}/?query=${query}`);
  };

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);
  return (
    <div className='search'>
      <div className='search-input-wrapper'>
        <Image
          src={"/icons/search.svg"}
          alt="search"
          width={24}
          height={24}
        />
        <Input
          type="text"
          placeholder='Search files'
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {
        open && (
          <ul className="search-result">
            {
              results.length > 0 ? (
                results.map((result) => (
                  <li key={result.$id}
                    className="flex items-center justify-between"
                    onClick={() => handleClickItem(result)}
                  >
                    <div className='flex cursor-pointer items-center gap-4'>
                      <Thumbnail
                        type={result.type}
                        extension={result.extension}
                        url={result.url}
                      />
                      <h6>
                        {result.name}
                      </h6>
                    </div>
                    <FormattedDateTime
                      date={result.$createdAt}
                      className="caption line-clamp-1 text-light-200"
                    />
                  </li>
                ))
              ) : (
                <p className='empty-result'>
                  No results found
                </p>
              )
            }
          </ul>
        )
      }
    </div>
  )
}

export default FileSearch;