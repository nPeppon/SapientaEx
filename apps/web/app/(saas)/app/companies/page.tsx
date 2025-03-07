"use client";

import { useEffect, useState } from "react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Textarea } from "@ui/components/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Trash2 } from "lucide-react";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";

interface Company {
  id: string;
  name: string;
  description: string | null;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const t = useTranslations();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies");
      if (!response.ok) throw new Error("Failed to fetch companies");
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      toast({
        title: t("app.companies.error.title"),
        description: t("app.companies.error.fetch"),
        variant: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) throw new Error("Failed to create company");

      const newCompany = await response.json();
      setCompanies([...companies, newCompany]);
      setName("");
      setDescription("");
      toast({
        title: t("app.companies.success.title"),
        description: t("app.companies.success.create"),
      });
    } catch (error) {
      toast({
        title: t("app.companies.error.title"),
        description: t("app.companies.error.create"),
        variant: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete company");

      setCompanies(companies.filter((company) => company.id !== id));
      toast({
        title: t("app.companies.success.title"),
        description: t("app.companies.success.delete"),
      });
    } catch (error) {
      toast({
        title: t("app.companies.error.title"),
        description: t("app.companies.error.delete"),
        variant: "error",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{t("app.companies.title")}</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("app.companies.form.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                {t("app.companies.form.name")}
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                {t("app.companies.form.description")}
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit">{t("app.companies.form.submit")}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {companies.map((company) => (
          <Card key={company.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{company.name}</h3>
                {company.description && (
                  <p className="text-sm text-gray-500">{company.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(company.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 