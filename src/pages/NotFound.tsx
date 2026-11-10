import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import pepper from "@/assets/capsicum-pepper.png";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <img src={pepper} alt="" className="mx-auto mb-6 h-14 w-14 object-contain" />
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-2 text-2xl font-semibold">This page isn't on the menu</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find <span className="font-mono">{location.pathname}</span>.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
