import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Geosynth. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/profiles" className="text-muted-foreground hover:text-foreground transition-colors">Profiles</Link>
            <Link to="/news" className="text-muted-foreground hover:text-foreground transition-colors">News</Link>
            <Link to="/demographics" className="text-muted-foreground hover:text-foreground transition-colors">Demographics</Link>
            <a href="https://github.com/nishitpatell/GeoSynth" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
