"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEVICE_TYPE_LABELS, DEVICE_TYPES } from "@/lib/device";

export function DeviceFilters({ q, type }: { q: string; type: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(q);

  const navigate = (nextQ: string, nextType: string) => {
    const params = new URLSearchParams();
    if (nextQ) params.set("q", nextQ);
    if (nextType) params.set("type", nextType);
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <form
        className="flex flex-1 gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(query, type);
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Buscar por marca, modelo o serie..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      <Select value={type} onValueChange={(value) => navigate(query, value ?? "")}>
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="Todos los tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos los tipos</SelectItem>
          {DEVICE_TYPES.map((item) => (
            <SelectItem key={item} value={item}>
              {DEVICE_TYPE_LABELS[item]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
