"use client";

import { useState, useCallback } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Upload, Play } from 'lucide-react';
import { generateJQQuery } from "@/ai/flows/generate-jq-query";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast";
import {executeQuery} from './actions';

const FileUpload = ({ jsonFile, setJsonFile }: { jsonFile: File | null; setJsonFile: React.Dispatch<React.SetStateAction<File | null>> }) => {
    const { toast } = useToast();
    const [jsonString, setJsonString] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setJsonFile(file);
          
          const reader = new FileReader();
          reader.onload = async (event) => {
              try {
                const fileContent = event.target?.result as string;
                setJsonString(JSON.stringify(JSON.parse(fileContent), null, 2))
              } catch (parseError) {
                  toast({
                    title: "Error",
                    description: "Invalid JSON file",
                    variant: "destructive",
                });
              }
            };
            reader.readAsText(file);
        } else {
          toast({
                title: "Error",
                description: "Please upload a JSON file.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-md border bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            >
                Upload JSON File
                <Upload className="ml-2 inline-block h-4 w-4" />
            </label>
            <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".json"
            />
            {jsonFile && <p>Selected file: {jsonFile.name}</p>}
            {jsonString && (
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <pre className="whitespace-pre-wrap">{jsonString}</pre>
              </ScrollArea>
            )}
        </div>
    );
};

const NaturalLanguageInput = ({ naturalLanguage, setNaturalLanguage, generateQuery }: { naturalLanguage: string; setNaturalLanguage: React.Dispatch<React.SetStateAction<string>>; generateQuery: () => Promise<void> }) => {
    return (
        <div className="flex flex-col space-y-2">
            <Textarea
                placeholder="Enter what you want to extract from the JSON in natural language..."
                className="resize-none"
                value={naturalLanguage}
                onChange={(e) => setNaturalLanguage(e.target.value)}
            />
            <Button onClick={generateQuery}>Generate JQ Query</Button>
        </div>
    );
};

const JQQuery = ({ jqQuery, setJqQuery, executeQueryHandler }: { jqQuery: string; setJqQuery: React.Dispatch<React.SetStateAction<string>>; executeQueryHandler: () => Promise<void> }) => {
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex">
                 <Textarea
                  placeholder="Generated JQ query will appear here..."
                  className="resize-none flex-grow"
                  value={jqQuery}
                  onChange={(e) => setJqQuery(e.target.value)} />
                <Button onClick={executeQueryHandler} className="ml-2">
                    <Play className="h-4 w-4 mr-2" />
                </Button>
            </div>
        </div>
    );
};

const Results = ({ results, downloadResults }: { results: string; downloadResults: () => void }) => {
  let resultsLength = 0;
  try {
    const parsedResults = JSON.parse(results);
    if (Array.isArray(parsedResults)) {
      resultsLength = parsedResults.length;
    }
  } catch (e) {
  }

  return (
    <div className="flex flex-col space-y-2 relative">
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <pre className="whitespace-pre-wrap">{results}</pre>
      </ScrollArea>
      <Button onClick={downloadResults} className="absolute top-0 right-0 mt-2 mr-2">Download Results</Button>
      <p className="mt-2">Number of elements: {resultsLength}</p>
    </div>
    );
};


export default function Home() {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [jqQuery, setJqQuery] = useState("");
  const [results, setResults] = useState("");
  const { toast } = useToast();

  const generateQuery = useCallback(async () => {
    if (!jsonFile) {
      toast({
        title: "Error",
        description: "Please upload a JSON file first.",
        variant: "destructive",
      });
      return;
    }

    if (!naturalLanguage) {
      toast({
        title: "Error",
        description: "Please enter a natural language query.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result as string;
        const data = await generateJQQuery({
          description: naturalLanguage,
          jsonFile: fileContent,
        });

        setJqQuery(data.jqQuery);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to generate JQ query.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(jsonFile);
  }, [jsonFile, naturalLanguage, toast]);

  const executeQueryHandler = async () => {
        if (!jsonFile) {
             toast({
              title: "Error",
              description: "Please upload a JSON file first.",
              variant: "destructive",
            });
            return;
        }

        if (!jqQuery) {
            toast({
              title: "Error",
              description: "Please generate a JQ query first.",
              variant: "destructive",
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const fileContent = event.target?.result as string;
                const result = await executeQuery({jqQuery:jqQuery, fileContent:fileContent});
                try {
                    const parsedResult = JSON.parse(result as string);
                    setResults(JSON.stringify(parsedResult, null, 2)); // Pretty print
                } catch (parseError) {
                    setResults(result as string); // Display as plain text if not valid JSON
                }
            } catch (error: any) {
                 toast({
                    title: "Error",
                    description: error.message || "Failed to execute JQ query.",
                    variant: "destructive",
                });
            }
        };
        reader.readAsText(jsonFile);
    };

    const downloadResults = () => {
        if (!results) {
            toast({
                title: "Error",
                description: "No results to download.",
                variant: "destructive",
            });
            return;
        }

        const blob = new Blob([results], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'results.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


  return (
      <div className="h-screen w-full p-4 flex flex-col">
          <Card className="flex-grow">
              <CardHeader>
                  <h2 className="text-lg font-semibold">JQ-Genius</h2>
              </CardHeader>
              <CardContent>
                  <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                          <FileUpload jsonFile={jsonFile} setJsonFile={setJsonFile} />
                          <NaturalLanguageInput naturalLanguage={naturalLanguage} setNaturalLanguage={setNaturalLanguage} generateQuery={generateQuery} />
                      </div>
                      <JQQuery jqQuery={jqQuery} setJqQuery={setJqQuery} executeQueryHandler={executeQueryHandler} />
                      <Results results={results} downloadResults={downloadResults} />
                  </div>
              </CardContent>
          </Card>
      </div>
  );
}
