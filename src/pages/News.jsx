import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { newsService } from "@/services/newsService";
import { Globe, Search, Newspaper, RefreshCw } from "lucide-react";

const DEFAULT_TOPIC = "world";
const DEFAULT_LIMIT = 18;

const categories = [
  { key: "world", label: "World" },
  { key: "business", label: "Business" },
  { key: "technology", label: "Technology" },
  { key: "science", label: "Science" },
  { key: "health", label: "Health" },
  { key: "sports", label: "Sports" },
  { key: "entertainment", label: "Entertainment" },
];

export default function News() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(categories[0].key);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  const searchText = useMemo(() => {
    if (query.trim()) return query.trim();
    return activeCat || DEFAULT_TOPIC;
  }, [query, activeCat]);

  const loadNews = async () => {
    setLoading(true);
    setError("");
    try {
      // Use the generic search endpoint to support global topics
      const res = await newsService.searchNews(searchText, "", DEFAULT_LIMIT);
      if (res.error) {
        setError(res.error);
        setArticles([]);
      } else {
        setArticles(res.articles || []);
      }
    } catch (e) {
      setError(e.message || "Failed to load news");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCat]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadNews();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Badge className="bg-primary text-primary-foreground px-3 py-1.5">
              <Globe className="w-4 h-4 mr-2" />
              Global News
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-3">Latest Headlines</h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Real-time headlines from trusted sources worldwide. Solid colors only, fully dark-mode compatible.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search topics (e.g., inflation, elections, ai)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" className="whitespace-nowrap">Search</Button>
          </form>
          <Button variant="outline" onClick={loadNews} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => (
            <Button
              key={c.key}
              variant={activeCat === c.key ? "default" : "outline"}
              className={activeCat === c.key ? "bg-primary text-primary-foreground" : ""}
              onClick={() => setActiveCat(c.key)}
              size="sm"
            >
              {c.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {error && (
          <div className="text-center text-destructive mb-6">{error}</div>
        )}

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading news...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a, idx) => (
              <Card key={`${a.url}-${idx}`} className="overflow-hidden border bg-card">
                {a.urlToImage ? (
                  <div className="aspect-video bg-muted">
                    <img
                      src={a.urlToImage}
                      alt={a.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Newspaper className="w-10 h-10 text-primary" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg leading-snug line-clamp-2">
                    <a href={a.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {a.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {a.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{a.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{a.source}</span>
                    <span>{newsService.formatDate(a.publishedAt)}</span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Read full story
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <div className="text-center text-muted-foreground py-12">No articles found.</div>
        )}
      </div>
    </div>
  );
}
