"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Textarea } from "@ui/components/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Trash2, Pencil, Plus, ChevronDown } from "lucide-react";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { AppWrapper } from "@saas/shared/components/AppWrapper";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/components/collapsible";
import { cn } from "@ui/lib";

interface Company {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

interface CompanyFormProps {
  name: string;
  description: string;
  editingCompany: Company | null;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

const CompanyForm = ({ 
  name, 
  description, 
  editingCompany,
  onNameChange,
  onDescriptionChange,
  onSubmit, 
  onCancel 
}: CompanyFormProps) => {
  const t = useTranslations();
  
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {t("app.companies.form.name")}
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          {editingCompany 
            ? t("app.companies.form.update")
            : t("app.companies.form.submit")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {t("app.companies.form.cancel")}
        </Button>
      </div>
    </form>
  );
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
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
      if (editingCompany) {
        const response = await fetch(`/api/companies/${editingCompany.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description }),
        });

        if (!response.ok) throw new Error("Failed to update company");

        const updatedCompany = await response.json();
        setCompanies(companies.map(company => 
          company.id === updatedCompany.id ? updatedCompany : company
        ));
        setEditingCompany(null);
        setName("");
        setDescription("");
        toast({
          title: t("app.companies.success.title"),
          description: t("app.companies.success.update"),
        });
      } else {
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
        setIsAddingNew(false);
        toast({
          title: t("app.companies.success.title"),
          description: t("app.companies.success.create"),
        });
      }
    } catch (error) {
      toast({
        title: t("app.companies.error.title"),
        description: editingCompany 
          ? t("app.companies.error.update")
          : t("app.companies.error.create"),
        variant: "error",
      });
    }
  };

  const handleEdit = useCallback((company: Company) => {
    setEditingCompany(company);
    setName(company.name);
    setDescription(company.description || "");
  }, []);

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

  const handleCancel = useCallback(() => {
    setEditingCompany(null);
    setName("");
    setDescription("");
    setIsAddingNew(false);
  }, []);

  const sortedCompanies = [...companies].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <AppWrapper>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">{t("app.companies.title")}</h1>
        
        <div className="grid gap-4">
          {sortedCompanies.map((company) => (
            <Card key={company.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    {company.description && (
                      <p className="text-sm text-gray-500">{company.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(company)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(company.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {editingCompany?.id === company.id && (
                  <CompanyForm 
                    name={name}
                    description={description}
                    editingCompany={editingCompany}
                    onNameChange={setName}
                    onDescriptionChange={setDescription}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                  />
                )}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="p-4">
              <Collapsible open={isAddingNew} onOpenChange={setIsAddingNew}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    {t("app.companies.form.title")}
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", {
                      "transform rotate-180": isAddingNew
                    })} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CompanyForm 
                    name={name}
                    description={description}
                    editingCompany={editingCompany}
                    onNameChange={setName}
                    onDescriptionChange={setDescription}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                  />
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppWrapper>
  );
} 