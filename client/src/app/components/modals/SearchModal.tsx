
'use client';

import React, { useState } from 'react';
import { Search, User, Music } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSearch } from '../../hooks/use-search';
import { useSearchStore } from '../../lib/store/search-store';

export function SearchModal() {
  const { isOpen, closeSearch, searchQuery, setSearchQuery } = useSearchStore();
  const [activeFilter, setActiveFilter] = useState('all');

  const genres = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Classical'];
  const languages = ['English', 'Spanish', 'Russian', 'French'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeSearch}>
      <DialogContent className="bg-zinc-900 text-zinc-50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Поиск</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Поиск треков или @пользователей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-50"
            />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-zinc-800">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="tracks">Треки</TabsTrigger>
              <TabsTrigger value="users">Пользователи</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Жанр</h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre}
                        variant="outline"
                        size="sm"
                        className={`border-zinc-700 ${
                          activeFilter === genre ? 'bg-zinc-700' : ''
                        }`}
                        onClick={() => setActiveFilter(genre)}
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Язык</h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <Button
                        key={language}
                        variant="outline"
                        size="sm"
                        className={`border-zinc-700 ${
                          activeFilter === language ? 'bg-zinc-700' : ''
                        }`}
                        onClick={() => setActiveFilter(language)}
                      >
                        {language}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tracks" className="mt-4">
              <div className="space-y-2">
                <div className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3">
                  <Music className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Название трека</p>
                    <p className="text-sm text-zinc-400">Исполнитель</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-4">
              <div className="space-y-2">
                <div className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3">
                  <User className="h-4 w-4" />
                  <div>
                    <p className="font-medium">@username</p>
                    <p className="text-sm text-zinc-400">Имя пользователя</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}